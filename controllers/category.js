const {Category,User, Role} = require('../db/models');
const {verifyTokenAndGetUserId} = require('../Middleware/userAuth');
const {getPagination,getPagingData,Checknegative} = require('../utils/transactions-response')

// creating category
// creating a category
const createCategory = async (req, res) => {
    try {

    const {user_Id,postCategory,status} = req.body;

    const userId = verifyTokenAndGetUserId(req);
    console.log(userId)
    if (!userId)
    return res.status(400).send({status:'Bad Request', message: " invalid or expired token"});

    let check_row = await User?.findOne({where:{id:userId}})
        
        if(!userId)
        return res.status(404).send({status: 'Not Found', message: 'User not Found'});

        let get_row = await Role?.findOne({where:{id:check_row?.roleId}})

        if(get_row?.name != 'admin')
        return res.status(401).send({ status: 'Unauthorised', message: "User Access Denied" })

        const categoryDta = {user_Id,postCategory,status}
        const data = await Category.create(categoryDta)
        if (data){
        //return res.status(200).send({ message: "Creation of Posts successful", post:{...post}});
        return res.status(200).send({ status: 'Success',message: "Creation of Category successful"});
        }else {
            return res.status(401).send({status: 'Unauthorised', message:'Category cannot be created'})
        }
    }catch{
        // console.log(error)
        return res.status(400).send({status: 'Bad Request', message:'Something went wrong'})
    }
}

// reading a category
const readCategory = async (req,res) => {
    try {

        
    const page = req.query.page;
    const size = req.query.size;

    let currentPage = Checknegative(page);
    if (currentPage)
    return res.status(400).send({status:'Bad Request', message:'User current page cannot negative',
    data:[],
});

    const { limit, offset } = getPagination(page, size);

    //    
    const userId = verifyTokenAndGetUserId(req);
    console.log(userId)
    if (!userId)
    return res.status(400).send({status:'Bad Request', message: " invalid or expired token"});

    let check_row = await User?.findOne({where:{id:userId}})
        
        if(!userId)
        return res.status(404).send({status: 'Not Found', message: 'User not Found'});

        let get_row = await Role?.findOne({where:{id:check_row?.roleId}})

        if(get_row?.name != 'admin')
        return res.status(401).send({ status: 'Unauthorised', message: "User Access Denied" })
        
        const data = await Category.findAndCountAll({
            limit,
            offset,
        attributes: {exclude:['id','user_Id','postId','createdAt','updatedAt']},
        });

        const response = getPagingData(data,page,limit)
        console.log(response)

        res.status(200).json({ message: "Retrieval of Categories successful", data:{...data}});
    } catch{
        // console.log(error)
        return res.status(400).send({status: 'Bad Request', message:'Something went wrong'})
    }
}

// Updating a category
const updateCategory = async(req, res) => {
    try {
    const {user_Id,postCategory,status} = req.body;
    const userId = verifyTokenAndGetUserId(req);
    console.log(userId)
    if (!userId)
    return res.status(400).send({status:'Bad Request', message: " invalid or expired token"});

    let check_row = await User?.findOne({where:{id:userId}})
        
        if(!userId)
        return res.status(404).send({status: 'Not Found', message: 'User not Found'});

        let get_row = await Role?.findOne({where:{id:check_row?.roleId}})

        if(get_row?.name != 'admin')
        return res.status(401).send({ status: 'Unauthorised', message: "User Access Denied" })
        
        const data = await Category.update(
        {user_Id,postCategory,status},
            {
                where:{id:req.params.id}
            }
        );
        if(data){
            return res.status(200).send({status: 'Success', message:'Categories updated'})
        }else {
            return res.status(401).send({status: 'Unauthorised', message:'Categories cannot be updated'}) 
        }
    }catch{
        // console.log(error)
        return res.status(400).send({status: 'Bad Request', message:'Something went wrong'}) 
    }
}

// deleting a category
const deleteCategory = async(req, res) =>{
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

    
    let data = await Category.destroy({
        where:{id:req.params.id}
    })
    if(data){
        return res.status(200).send({status:"success", message:"Category deleted!"});
    }else{
        return res.status(400).send({status:"Bad  Request", message:"Something Went Wrong!"});
    }
    }catch{
        return res.status(401).send({status:'Unauthorised', message:'Category cannot be deleted'})
    }
}
module.exports = {
    createCategory,
    readCategory,
    updateCategory,
    deleteCategory
}