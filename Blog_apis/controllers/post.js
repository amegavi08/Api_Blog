const { id, error } = require('@hapi/joi/lib/base');
const {Post, User, Role, Comment,Category} = require('../db/models');
const {uploadFrontCard} = require('../helpers/fileUpload');
const {verifyTokenAndGetUserId} = require('../Middleware/userAuth');
const {getPagination,getPagingData,Checknegative} = require('../utils/transactions-response')


// User Blog Post or Creation
const createPost = async (req, res) => {
    try {
        const {user_Id, author_name, title, description,postcategory,imageUpload} = req.body;
        const userId = verifyTokenAndGetUserId(req);
        console.log(userId)
        if (!userId)
        return res.status(400).send({status:'Bad Request', message: " invalid or expired token"});

        let check_row = await User?.findOne({where:{id:userId}})
            
         if(!userId)
         return res.status(404).send({status: 'Not Found', message: 'User not Found'});

         let get_row = await Role?.findOne({where:{id:check_row?.roleId}})

         if(get_row?.name != 'admin')
         if(get_row?.name != 'user')
         return res.status(401).send({ status: 'Unauthorised', message: "User Access Denied" })

        // Image upload
        if(imageUpload == null || imageUpload == undefined || imageUpload == '')
        return res.status(400).send({status: 'Bad Request', message:"file can't be empty"});
    
        var image_matches = imageUpload?.match(
          /^data:([A-Za-z-+\/]+);base64,(.+)$/,
        );
    
        if(!image_matches)
        return res.status(400).send({status: 'Bad Request', message:"Invalid input file"});
    
        let user_image = await uploadFrontCard(imageUpload)

        // retrieve the user from the database based on the provided email
        const data = {user_Id, author_name, title, description, postcategory,imageUpload:user_image}
        const post = await Post.create(data)
        if (post){
        //return res.status(200).send({ message: "Creation of Posts successful", post:{...post}});
        return res.status(200).send({ status: 'Success',message: "Creation of Posts successful"});
        }else {
            return res.status(401).send({status: 'Unauthorised', message:'Post cannot be created'})
        }

    } catch(error){
        console.log(error)
        return res.status(401).send({status: "Unauthorised", message: "User cannot create Post"})
    }
}

// User Blog read
const readPost = async (req, res) => {
    try{

        const page = req.query.page;
        const size = req.query.size;

        let currentPage = Checknegative(page);
        if(currentPage)
            return res.status(401).send({status:'Unauthorised', message: 'User current page cannot be negative',
            data:[],
        });

        const { limit, offset } = getPagination(page, size);
        //

        const userId = verifyTokenAndGetUserId(req);
        console.log(userId)

        if (!userId)
        return res.status(400).send({status:'Bad Request', message:'Invalid or expired token'});

        let check_row = await User?.findOne({where:{id:userId}})

        if (!userId)
        return res.status(404).send({status:'Not Found', message:'User Not Found'});

        let get_row = await Role?.findOne({where:{id:check_row?.roleId}})

        if(get_row?.name != 'admin')
        if(get_row?.name != 'user')
        return res.status(401).send({ status: 'Bad Request', message: "User Access Denied" })

        let data = await Post.findAndCountAll({
            limit,
            offset,
            attributes: {exclude:['createdAt','updatedAt']},
        
              include:[
                {
                    model:Comment,
                    attributes: {exclude:['id','user_Id','postId','status','createdAt','updatedAt']},
                    order: [['id','DESC']],
                    as:'post_comment'
                  },
              ]
        });
        const response = getPagingData(data,page,limit)
        console.log(response)
        return res.status(200).json({message:'Retrieval of Post Successful', data:{...data}});
    }catch (error){
        console.log(error)
        return res
        .status(401)
        .send({status: "Unauthorised", message:"Post cannot be retrieved"});
    }
}

// User Blog Update
const updatePost = async (req, res) =>{
    try {
        const userId = verifyTokenAndGetUserId(req);
console.log(userId)
  if (!userId)
  return res.status(400).send({ status: 'Bad Request', message: "Invalid or expired token." });

  let check_row = await User?.findOne({where:{id:userId}})

  if (!userId)
  return res.status(404).send({ status: 'Not Found', message: "User Not Found." });

  let get_row = await Role?.findOne({where:{id:check_row?.roleId}})

  if(get_row?.name != 'admin')
  return res.status(401).send({ status: 'Unauthorised', message: "User Access Denied" });

  const {user_Id, author_name, title, description, postcategory,imageUpload} = req.body;

  // Image upload
  if(imageUpload == null || imageUpload == undefined || imageUpload == '')
  return res.status(400).send({status: 'Bad Request', message:"file can't be empty"});

  var image_matches = imageUpload?.match(
    /^data:([A-Za-z-+\/]+);base64,(.+)$/,
  );

  if(!image_matches)
  return res.status(400).send({status: 'Bad Request', message:"Invalid input file"});

  let user_image = await uploadFrontCard(imageUpload)
  
  let data = await Post.update({user_Id, author_name, title, description, postcategory,imageUpload:user_image},
    {
        where: {id:req.params.id}
    }
    );
    if (data){
        return res.status(200).send({status:'Success',message: 'Post Updated'});
    }else {
        return res.status(401).send({status:'Unauthorised',message: 'Post Cnanot be Updated'});
    }
    }catch{
        // console.log(error)
        return res
        .status(400)
        .send({status: "Bad Request", message:"Somethong went wrong"});
    }
}

// Delete Blog Post
const deletePost = async (req, res) => {
    try {

        
    const userId = verifyTokenAndGetUserId(req);
    console.log(userId)
    if (!userId)
    return res.status(400).send({ status: 'Bad Request', message: "Invalid or expired token." });

    let check_row = await User?.findOne({where:{id:userId}})

    if (!userId)
    return res.status(404).send({ status: 'Not Found', message: "User Not Found." });

    let get_row = await Role?.findOne({where:{id:check_row?.roleId}})

    if(get_row?.name != 'admin')
    return res.status(401).send({ status: 'Unauthorised', message: "User Access Denied" })
  
        let data = await Post.destroy({
            where:{
                id:req.params.id
            }
        });
  
        if(data){
            return res.status(200).send({status:"success", message:"Post deleted!"});
        }else{
            return res.status(400).res.send({status:'Bad Request', message:"Post cannot be deleted"});
        }
      
    } catch (error) {
        // console.log(error)
        return res
        .status(400)
        .send({status: "Bad request", message:"Something went wrong"});
    }
  }
module.exports = {
    createPost,
    readPost,
    updatePost,
    deletePost
}