const {Category,User, Role} = require('../db/models');
const {verifyTokenAndGetUserId} = require('../Middleware/userAuth');

// creating category
// creating a category
const createCategory = async (req, res) => {
    try {
    const {user_Id, postId,postCategory} = req.body;

    const userId = verifyTokenAndGetUserId(req);
    console.log(userId)
    if (!userId)
    return res.status(401).send({status:'false', message: " invalid or expired token"});

    let check_row = await User?.findOne({where:{id:userId}})
        
        if(!userId)
        return res.status(401).send({status: 'false', message: 'User not Found'});

        let get_row = await Role?.findOne({where:{id:check_row?.roleId}})

        if(get_row?.name != 'admin')
        if(get_row?.name != 'user')
        return res.status(401).send({ status: 'false', message: "User Access Denied" })

        const categoryDta = {user_Id, postId,postCategory}
        const data = await Category.create(categoryDta)
        if (data){
        //return res.status(200).send({ message: "Creation of Posts successful", post:{...post}});
        return res.status(200).send({ status: 'Success',message: "Creation of Category successful"});
        }else {
            return res.status(400).send({status: 'Unauthorised', message:'Category cannot be created'})
        }
    }catch (error){
        console.log(error)
    }
}

// reading a category
const readCategory = async (req,res) => {
    try {

    const userId = verifyTokenAndGetUserId(req);
    console.log(userId)
    if (!userId)
    return res.status(401).send({status:'false', message: " invalid or expired token"});

    let check_row = await User?.findOne({where:{id:userId}})
        
        if(!userId)
        return res.status(401).send({status: 'false', message: 'User not Found'});

        let get_row = await Role?.findOne({where:{id:check_row?.roleId}})

        if(get_row?.name != 'admin')
        if(get_row?.name != 'user')
        return res.status(401).send({ status: 'false', message: "User Access Denied" })
        
        const data = await Category.findAll({
        attributes: {exclude:['id','user_Id','postId','createdAt','updatedAt']},
        });
        res.status(200).json({ message: "Retrieval of Categories successful", data:{...data}});
    } catch (error){
        console.log(error)
    }
}

// Updating a category
const updateCategory = async(req, res) => {
    try {
    const {user_Id, postId,postCategory} = req.body;
    const userId = verifyTokenAndGetUserId(req);
    console.log(userId)
    if (!userId)
    return res.status(401).send({status:'false', message: " invalid or expired token"});

    let check_row = await User?.findOne({where:{id:userId}})
        
        if(!userId)
        return res.status(401).send({status: 'false', message: 'User not Found'});

        let get_row = await Role?.findOne({where:{id:check_row?.roleId}})

        if(get_row?.name != 'admin')
        return res.status(401).send({ status: 'false', message: "User Access Denied" })
        
        const data = await Category.update(
        {user_Id, postId,postCategory},
            {
                where:{id:req.params.id}
            }
        );
        if(data){
            return res.status(200).send({status: 'Success', message:'Categories updated'})
        }else {
            return res.status(400).send({status: 'Unauthorised', message:'Categories cannot be updated'}) 
        }
    }catch (error){
        console.log(error)
    }
}

// deleting a category
const deleteCategory = async(req, res) =>{
    try{
        const userId = verifyTokenAndGetUserId(req);
    console.log(userId)
    if (!userId)
    return res.status(401).send({ status: false, message: "Invalid or expired token." });

    let check_row = await User?.findOne({where:{id:userId}})

    if (!userId)
    return res.status(401).send({ status: false, message: "User Not Found." });

    let get_row = await Role?.findOne({where:{id:check_row?.roleId}})

    if(get_row?.name != 'admin')
    return res.status(401).send({ status: false, message: "User Access Denied" })

    
    let data = await Category.destroy({
        where:{id:req.params.id}
    })
    if(data){
        res.send({status:"success", message:"Category deleted!"});
    }else{
        res.send({status:"false", message:"Something Went Wrong!"});
    }
    }catch(error){
        console.log(error)
    }
}
module.exports = {
    createCategory,
    readCategory,
    updateCategory,
    deleteCategory
}