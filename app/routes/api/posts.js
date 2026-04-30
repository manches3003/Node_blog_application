const express = require('express');
const router = express.Router();
const postController = require('../../controllers/postController');

// GET /api/posts - Get all posts
router.get('/posts', postController.getAllPosts);

// GET /api/posts/:id - Get single post by ID
router.get('/posts/:id', postController.getPostById);

// POST /api/posts - Create new post
router.post('/posts', postController.createPost);

// PUT /api/posts/:id - Update existing post
router.put('/posts/:id', postController.updatePost);

// DELETE /api/posts/:id - Delete post
router.delete('/posts/:id', postController.deletePost);

module.exports = router;
