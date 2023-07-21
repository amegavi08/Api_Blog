const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment')
const verifyToken = require("../Middleware/verify_token");

// route for creating comments
router.post('/createcomment',commentController.createComment);

// route for reading a comment
router.get('/readcomment',commentController.readComment);

// route for updating a comment
router.put('/updatecomment/:id',commentController.updateComment);

//route for deleting a comment
router.delete('/deletecomment/:id',commentController.deleteComment);


module.exports = router;