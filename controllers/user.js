const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const {User, Role} = require('../db/models')
const {sendingMail} = require('../nodemailer/mailing')
const {uploadFrontCard} = require('../helpers/fileUpload')
const {createToken,createAccessToken,generateRefreshToken,verifyUserToken} = require("../utils/index");
const { verifyTokenAndGetUserId } = require('../Middleware/userAuth');
const {getPagination,getPagingData,Checknegative,searchUsers} = require('../utils/transactions-response')


// Signing up User
const signup = async (req, res) => {
    try {
        const {firstname,lastname,username,email,password,
        phonenumber,imageUpload,isVerified,
        roleId} = req.body;
        
        if(imageUpload == null || imageUpload == undefined || imageUpload == '')
        return res.status(400).send({status: 'Bad Request', message:"file can't be empty"});
    
        var image_matches = imageUpload?.match(
          /^data:([A-Za-z-+\/]+);base64,(.+)$/,
        );
    
        if(!image_matches)
        return res.status(400).send({status: 'Bad Request', message:"Invalid input file"});
    
        let user_image = await uploadFrontCard(imageUpload)

        const data = {firstname,lastname,username,email,
            password: await bcrypt.hash(password, 10),
            phonenumber,imageUpload:user_image,
            isVerified,
            roleId}

        // Save User in the database
        const user = await User.create(data);
        console.log(user.toJSON());
    
          let setToken = createToken(user)

              //if user details are captured
      //send an email to the user
      if (user) {
         sendingMail({firstname,email,setToken})
        
        // Return messages
        return res.status(201).send({status: "Created", message:"User Created"});
      } else {
        return res.status(409).send({status: "Conflict", message:"User already exist"});
      }

    } catch(error){
        console.log(error)
        return res
        .status(500)
        .send({status: "Internal Server Error", message:"Sorry somethng went wrong"});
    }
};

// Verifying the email of the user
const verifyEmail = async(req, res) => {
    try{
        const token = req.params.token;

        let decodeToken = verifyUserToken(token)
        console.log(decodeToken?.userId)

        if (!decodeToken)
        return res.status(400).send({status: "Bad Request", message:"User not verified"});

        const userToken = await User.findOne({where:{id: decodeToken?.userId}})

        if(!userToken)
        return res.status(400).send({status: "Bad Request", message:"User not verified"});

        const updated = await User.update(
            { isVerified: true },
            {
                where: {
                    id: userToken.id,
                },
            }
            );
        return res
        .status(200)
        .send({status: "OK", message:"Your account has been successfully verified"});
    }catch{
        // console.log(error)
        return res
        .status(400)
        .send({status: "Bad Request", message:"Your account cannot be verified"});
    }
};

// Login User
const login = async (req, res) =>{
    try{
        const {email, password} = req.body;

        // retrieve the user from the database based on the provided email
        const user = await User.findOne({where: {
            email:email
        }});
        console.log(user);
    // If user email is found, compare password with bcrypt
    if (user){
        const isSameEmail = email === user.email;
        const isSamePassword = await bcrypt.compare(password, user.password);
        // If both email and password are the same 
        // If verified, generate a token and use it for the access and refresh tokens for
        // the user
    if (isSameEmail && isSamePassword) {
        // Check if they are verified
        const verified = user.isVerified;
        if(!verified){
            return res.status(401).send({status: "Unauthorised", message: "User not verified"})
        }else {
            if (verified) {
                let accessToken = await createAccessToken(user);
                let refreshToken = await generateRefreshToken(user);

                    let tokens = {
                        accessToken,
                        refreshToken
                    }
                    let user_data = {
                        id:user?.id,
                        firstname:user?.firstname,
                        username:user?.username,
                        email:user?.email,
                        phonenumber:user?.phonenumber
                    }
                    // Sending user data

                    res.status(200).send({status: "Ok", message: "Login Successful",
                    user: {...user_data},
                    token: {...tokens}
                });
                console.log(user_data,tokens)
            }
        }
    } else {
        return res.status(401).send({status: "Unauthorised", message: "Inavalid Email or Password"})
    }
    } else {
        return res.status(404).send({status: "False", message: "User Not Found; Signup First"})
    }
    }catch{
        return res.status(500).send({ status: "Error", message: "Internal Server Error" });
    }
};


// Creating user
const createUser = async (req, res) => {
    try {

        const {firstname,lastname,username,email,password,
            phonenumber,imageUpload,isVerified,
            roleId} = req.body;

        //
        const userId = verifyTokenAndGetUserId(req);
        if (!userId)
        return res.status(401).send({status:'Bad Request', message: " invalid or expired token"});

        let check_row = await User?.findOne({where:{id:userId}})
            
         if(!userId)
         return res.status(404).send({status: 'Not Found', message: 'User not Found'});

         let get_row = await Role?.findOne({where:{id:check_row?.roleId}})

         if(get_row?.name != 'admin')
         if(get_row?.name != 'user')
         return res.status(401).send({ status: false, message: "User Access Denied" })
        
        if(imageUpload == null || imageUpload == undefined || imageUpload == '')
        return res.status(400).send({status: 'Bad Request', message:"file can't be empty"});
    
        var image_matches = imageUpload?.match(
          /^data:([A-Za-z-+\/]+);base64,(.+)$/,
        );
    
        if(!image_matches)
        return res.status(400).send({status: 'Bad Request', message:"Invalid input file"});
    
        let user_image = await uploadFrontCard(imageUpload)

        const data = {firstname,lastname,username,email,
            password: await bcrypt.hash(password, 10),
            phonenumber,imageUpload:user_image,
            isVerified,
            roleId}

        // Save User in the database
        const user = await User.create(data);
      if (user) {
        // Return messages
        return res.status(201).send({status: "Created", message:"User Created"});
      } else {
        return res.status(409).send({status: "Conflict", message:"User already exist"});
      }

    } catch(error){
        console.log(error)
        return res
        .status(500)
        .send({status: "Bad Request", message:"Internal server error"});
    }
}

// Read all Users
const findAllUsers = async (req, res) => {
    try {
        // Filter and Pagination
        // const filter = req.body.query;
        // let where = {};
        // if (filter.firstname) {
        //     where.firstname = {[Sequelize.Op.Like]: `%${filter.firstname}%`};
        // }


        const page = req.query.page;
        const size = req.query.size;

        let currentPage = Checknegative(page);
        if(currentPage)
            return res.status(200).send({status:true, message: 'User current page cannot negative',
            data:[],
        });

        const { limit, offset } = getPagination(page, size);
        
        //
        const userId = verifyTokenAndGetUserId(req);
        if (!userId)
        return res.status(401).send({status:'Bad Request', message: " invalid or expired token"});

        let check_row = await User?.findOne({where:{id:userId}})
            
         if(!userId)
         return res.status(404).send({status: 'Not Found', message: 'User not Found'});

         let get_row = await Role?.findOne({where:{id:check_row?.roleId}})

         if(get_row?.name != 'admin')
         if(get_row?.name != 'user')
         return res.status(401).send({ status: false, message: "User Access Denied" })
         let data = await User.findAndCountAll({

            limit,
            offset,

            attributes: {exclude:['createdAt','updatedAt']},
            include:[
              {
                model:Role,
                attributes: {exclude:['status','createdAt','updatedAt']},
                order: [['id','DESC']],
                as:'user_role'
              },
            ],
            attributes: {exclude:['password','createdAt','updatedAt']},
            order: [['id','DESC']]
          });

          const response = getPagingData(data,page,limit)
          console.log(response)
          
          return res.status(200).json({ message: "Retrieval of Users successful", data:{...data}});
        // return res.status(200).json({status:'Success', message: "Retrieval of Users successful", filter,count: result.length,page,data:data});
         
    }catch{
        res.status(400).send({ status: "Bad Request", message: "Users cannot be rertrieved!" });
    }
}

// Update users
const updateUsers = async (req, res) => {
    try {

        //
        const userId = verifyTokenAndGetUserId(req);
        if (!userId)
        return res.status(400).send({status:'Bad Request', message: " invalid or expired token"});

        let check_row = await User?.findOne({where:{id:userId}})
            
        if(!userId)
        return res.status(400).send({status: 'Bad Request', message: 'User not Found'});

        let get_row = await Role?.findOne({where:{id:check_row?.roleId}})

        if(get_row?.name != 'admin')
        if(get_row?.name != 'user')
        return res.status(401).send({ status: 'Unauthorised', message: "User Access Denied" })

        const {firstname,lastname,username,email,password,
            phonenumber,imageUpload,isVerified,
            roleId} = req.body
        
         // Image upload
        if(imageUpload == null || imageUpload == undefined || imageUpload == '')
        return res.status(400).send({status: 'false', message:"file can't be empty"});

        var image_matches = imageUpload?.match(
            /^data:([A-Za-z-+\/]+);base64,(.+)$/,
        );

        if(!image_matches)
        return res.status(400).send({status: false, message:"Invalid input file"});

        let user_image = await uploadFrontCard(imageUpload)

        const data = await User.update({
            firstname,lastname,username,email,password: await bcrypt.hash(password, 10),
            phonenumber,imageUpload:user_image,isVerified,
            roleId
        },
        {
            where: {id:req.params.id}
        }
        );

        if (data) {
            return res.status(200).send({status:"Success", message:"User updated"});
        }else {
            return res.status(401).send({status:"Unauthorised", message:"User cannot be updated"});
        }
        
    } catch {
        return res.status(400).send({status:"Bad Request", message:"Something went wrong"});
    }
}

// Delete Users
const deleteUser = async (req, res) => {
    try {
    //
    const userId = verifyTokenAndGetUserId(req);
    if (!userId)
    return res.status(400).send({status:'Bad Request', message: " invalid or expired token"});

    let check_row = await User?.findOne({where:{id:userId}})
        
        if(!userId)
        return res.status(404).send({status: 'Not Found', message: 'User not Found'});

        let get_row = await Role?.findOne({where:{id:check_row?.roleId}})

        if(get_row?.name != 'admin')
        return res.status(401).send({ status: 'unAuthorised', message: "User Access Denied" })

        const data = await User.destroy({
            where: {
                id: req.params.id
            }
        });

        if (data) {
            return res.status(200).send({status: 'Success', message:'User deleted successfully'})
        }else {
            return res.status(401).send({status: 'Unauthorised', message:'User cannot be deleted successfully'})
        }

    }catch {
        return res.status(400).send({status: 'Bad Request', message:'Something went wrong'})
    }
}


// Search Users
const searchUser = async (req,res) => {
  const name = req.params.username
   try{

    const user = await searchUsers(name);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }


   }catch(err){
     console.error("Error while searching for user:", err);
     res.status(500).json({ message: "Internal server error" });
   }
}

// Filter Users by Date range
const filterUsersByDateRange = async (req, res) => {
    try {
        const {createdAt} = req.query;
        const filteredUsers = await User.findAll({
            
                createdAt:req.params.createdAt
            
        });
        if (filteredUsers){
             res.status(200).json({message: "Success filtering Users by date range"
             ,filteredUsers:{...filteredUsers}});
        } else {
            return res.status(404).send({status:'Not Found', message: 'User not found'})
        }
    }catch(error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports = {
    signup,
    verifyEmail,
    login,
    createUser,
    findAllUsers,
    updateUsers,
    deleteUser,
    searchUser,
    filterUsersByDateRange

}


