import express from 'express';

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user cart
// @access  Private
router.get('/', (req, res) => {
  res.json({ message: 'Get cart' });
});

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', (req, res) => {
  res.json({ message: 'Add to cart' });
});

// @route   DELETE /api/cart/:id
// @desc    Remove item from cart
// @access  Private
router.delete('/:id', (req, res) => {
  res.json({ message: 'Remove from cart' });
});

export default router;
