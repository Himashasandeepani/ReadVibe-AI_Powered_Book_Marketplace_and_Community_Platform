import express from 'express';

const router = express.Router();

// @route   GET /api/community/posts
// @desc    Get all community posts
// @access  Public
router.get('/posts', (req, res) => {
  res.json({ message: 'Get all posts' });
});

// @route   POST /api/community/posts
// @desc    Create community post
// @access  Private
router.post('/posts', (req, res) => {
  res.json({ message: 'Create post' });
});

// @route   DELETE /api/community/posts/:id
// @desc    Delete community post
// @access  Private
router.delete('/posts/:id', (req, res) => {
  res.json({ message: 'Delete post' });
});

export default router;
