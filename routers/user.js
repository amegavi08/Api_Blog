const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const verifyToken = require("../Middleware/verify_token");
const userAuth = require('../Middleware/userAuth');




/**
 * @openapi
 *  tags:
 *    name: User
 *    description: Operations for users - signup, login, verifyEmail, get
 * 
 */

/**
 * @openapi
 * /signup:
 *   post:
 *     summary: Sign up users
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully registered
 */



//signup endpoint
//passing the middleware function to the signup
// router.post('/signup', userAuth.saveUser)
router.post('/signup',userAuth.saveUser,userController.signup)

// Login User
router.post('/login',userController.login)

// Email verification
router.get('/verify-email/:token',userController.verifyEmail)

// Read all user
router.get('/getAllUsers',userController.findAllUsers)

module.exports = router;