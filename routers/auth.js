const express = require('express');

const authController = require('../controllers/auth');

const verifyToken = require("../Middleware/verify_token");

const router = express.Router();

router.post('/api/v1/change-password/:id',[verifyToken],authController.ChangePassword);

router.post('/api/v1/forget-password',authController.ForgetPassword);

router.post('/api/v1/reset-password/:token',authController.ResetPassword);

module.exports = router;