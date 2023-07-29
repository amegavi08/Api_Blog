const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category')

// route for creating categories
router.post('/createcategory',categoryController.createCategory);

// route for reading categories
router.get('/readcategory',categoryController.readCategory);

// route for updating categories
router.put('/updatecategory/:id',categoryController.updateCategory);

//route for deleting a comment
router.delete('/deletecategory/:id',categoryController.deleteCategory);

// search by status
router.get('/search/:status', categoryController.searchCategoryStatus)

module.exports = router;