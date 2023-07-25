const {Comment, Role, User} = require('../db/models');
const {verifyTokenAndGetUserId} = require('../Middleware/userAuth');

//
// creating a comment
const createComment = async (req, res) => {
    try {
    const {user_Id, postId,userComments, status} = req.body;

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

        const commentDta = {user_Id, postId,userComments, status}
        const data = await Comment.create(commentDta)
        if (data){
        //return res.status(200).send({ message: "Creation of Posts successful", post:{...post}});
        return res.status(200).send({ status: 'Success',message: "Creation of Comments successful"});
        }else {
            return res.status(400).send({status: 'Unauthorised', message:'Comments cannot be created'})
        }
    }catch (error){
        console.log(error)
    }
}

// reading a comment
const readComment = async (req,res) => {
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
        
        const data = await Comment.findAll({
        attributes: {exclude:['id','user_Id','postId','status','createdAt','updatedAt']},
        });
        res.status(200).json({ message: "Retrieval of Comments successful", data:{...data}});
    } catch (error){
        console.log(error)
    }
}

// Updating a comment
const updateComment = async(req, res) => {
    try {
    const {user_Id, postId,userComments, status} = req.body;
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
        
        const data = await Comment.update(
        {user_Id, postId,userComments, status},
            {
                where:{id:req.params.id}
            }
        );
        if(data){
            return res.status(200).send({status: 'Success', message:'Comments updated'})
        }else {
            return res.status(400).send({status: 'Unauthorised', message:'Comments cannot be updated'}) 
        }
    }catch (error){
        console.log(error)
    }
}

// deleting a comment
const deleteComment = async(req, res) =>{
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

    
    let data = await Comment.destroy({
        where:{id:req.params.id}
    })
    if(data){
        res.send({status:"success", message:"Comment deleted!"});
    }else{
        res.send({status:"false", message:"Something Went Wrong!"});
    }
    }catch(error){
        console.log(error)
    }
}
module.exports = {
    createComment,
    readComment,
    updateComment,
    deleteComment
}