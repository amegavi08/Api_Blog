const {Comment, Role, User} = require('../db/models');
const {verifyTokenAndGetUserId} = require('../Middleware/userAuth');
const {getPagination,getPagingData,Checknegative} = require('../utils/transactions-response')


//
// creating a comment
const createComment = async (req, res) => {
    try {
    const {user_Id, postId,userComments, status} = req.body;

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

        const commentDta = {user_Id, postId,userComments, status}
        const data = await Comment.create(commentDta)
        if (data){
        //return res.status(200).send({ message: "Creation of Posts successful", post:{...post}});
        return res.status(200).send({ status: 'Success',message: "Creation of Comments successful"});
        }else {
            return res.status(401).send({status: 'Unauthorised', message:'Comments cannot be created'})
        }
    }catch{
        // console.log(error)
        return res.status(400).send({status: 'Bad Request', message:'Something went wrong'})
    }
}

// reading a comment
const readComment = async (req,res) => {
    try {
    
    const page = req.query.page;
    const size = req.query.size;

    let currentPage = Checknegative(page);
    if(currentPage)
        return res.status(400).send({status:'Bad Request', message: 'User current page cannot be negative',
        data:[],
    });

    const { limit, offset } = getPagination(page, size);
    
    const userId = verifyTokenAndGetUserId(req);
    console.log(userId)
    if (!userId)
    return res.status(401).send({status:'false', message: " invalid or expired token"});

    let check_row = await User?.findOne({where:{id:userId}})
        
        if(!userId)
        return res.status(404).send({status: 'Not Found', message: 'User not Found'});

        let get_row = await Role?.findOne({where:{id:check_row?.roleId}})

        if(get_row?.name != 'admin')
        if(get_row?.name != 'user')
        return res.status(401).send({ status: 'Unauthorised', message: "User Access Denied" })
        
        const data = await Comment.findAndCountAll({
            limit,
            offset,
        attributes: {exclude:['id','user_Id','postId','status','createdAt','updatedAt']},
        });

        const response = getPagingData(data,page,limit)
        console.log(response)

        return res.status(200).json({ message: "Retrieval of Comments successful", data:{...data}});
    } catch{
        return res.status(401).send({status: "Unauthorised", message: "Comments cannot be retrieved"})
    }
}

// Updating a comment
const updateComment = async(req, res) => {
    try {
    const {user_Id, postId,userComments, status} = req.body;
    const userId = verifyTokenAndGetUserId(req);
    console.log(userId)
    if (!userId)
    return res.status(400).send({status:'Bad Request', message: " invalid or expired token"});

    let check_row = await User?.findOne({where:{id:userId}})
        
        if(!userId)
        return res.status(404).send({status: 'Not Found', message: 'User not Found'});

        let get_row = await Role?.findOne({where:{id:check_row?.roleId}})

        if(get_row?.name != 'admin')
        return res.status(401).send({ status: 'falsUnauthorised', message: "User Access Denied" })
        
        const data = await Comment.update(
        {user_Id, postId,userComments, status},
            {
                where:{id:req.params.id}
            }
        );
        if(data){
            return res.status(200).send({status: 'Success', message:'Comments updated'})
        }else {
            return res.status(401).send({status: 'Unauthorised', message:'Comments cannot be updated'}) 
        }
    }catch{
        // console.log(error)
        return res.status(400).send({status: 'Bad Request', message:'Something went wrong'}) 
    }
}

// deleting a comment
const deleteComment = async(req, res) =>{
    try{
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

    
    let data = await Comment.destroy({
        where:{id:req.params.id}
    })
    if(data){
        return res.status(200).send({status:"success", message:"Comment deleted!"});
    }else{
        return res.status(401).send({status:"Unauthorised", message:"Comment cannot be deleted"});
    }
    }catch{
        return res.status(400).send({status:"Bad Request", message:"Something Went Wrong!"});
    }
}
module.exports = {
    createComment,
    readComment,
    updateComment,
    deleteComment
}