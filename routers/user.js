const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const verifyToken = require("../Middleware/verify_token");
const userAuth = require('../Middleware/userAuth');

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', userAuth.saveUser)
router.post('/signup',userController.signup)

// Login User
router.post('/login',userController.login)

// Email verification
router.get('/verify-email/:token',userController.verifyEmail)

// Read all user
router.get('/getAllUsers',userController.findAllUsers)

module.exports = router;