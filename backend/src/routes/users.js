import express from 'express';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', (req, res) => {
  res.json({ message: 'Get user profile' });
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', (req, res) => {
  res.json({ message: 'Update user profile' });
});

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', (req, res) => {
  res.json({ message: 'Get all users' });
});

export default router;
