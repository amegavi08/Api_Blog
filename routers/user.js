const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const verifyToken = require("../Middleware/verify_token");
const userAuth = require('../Middleware/userAuth');
// const {filterUsersByDateRange} = require('../controllers/user')

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - username
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         firstname:
 *           type: string
 *           description: User's first name
 *           example: John
 *         lastname:
 *           type: string
 *           description: User's last name
 *           example: Doe
 *         username:
 *           type: string
 *           description: User's unique username
 *           example: johndoe123
 *         email:
 *           type: string
 *           description: User's email address
 *           example: user@example.com
 *         phonenumber:
 *           type: string
 *           description: User's contact number
 *           example: +1234567890
 *         password:
 *           type: string
 *           description: User's password (hashed)
 *           example: password123
 *         imageUpload:
 *           type: string
 *           description: URL or path to user's profile image
 *           example: /uploads/profile123.jpg
 *         roleId:
 *           type: integer
 *           description: ID of the user's role
 *           example: 2
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         firstname: John
 *         lastname: Doe
 *         username: johndoe123
 *         email: user@example.com
 *         phonenumber: +1234567890
 *         password: password123
 *         imageUpload: /uploads/profile123.jpg
 *         roleId: 2
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phonenumber:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               imageUpload:
 *                 type: string
 *                 format: binary
 *               roleId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - validation error
 *       409:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post('/user/signup', userAuth.saveUser, userController.signup)

// Login User
router.post('/login', userController.login)

// Email verification
router.get('/verify-email/:token', userController.verifyEmail)

// Create user
router.post('/createuser', userAuth.saveUser, userController.createUser)

// Read all user
router.get('/getAllUsers', userController.findAllUsers)

// Update users
router.put('/updateuser/:id', userController.updateUsers)

// Delete user
router.delete('/deleteuser/:id', userController.deleteUser)

// Search 
router.get('/search/:username', userController.searchUser)

// Filtering By Date range
router.get('/filteredUsers', userController.filterUsersByDateRange);

module.exports = router;