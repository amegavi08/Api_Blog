const express = require('express');
const router = express.Router()
const postController = require('../controllers/post')

// Create Post
router.post('/userpost',postController.createPost);

// Read Post
router.get('/readpost',postController.readPost);

// Update Post
router.put('/updatepost/:id',postController.updatePost);

// Delete Post
router.delete('/deletepost/:id',postController.deletePost);

module.exports = router;