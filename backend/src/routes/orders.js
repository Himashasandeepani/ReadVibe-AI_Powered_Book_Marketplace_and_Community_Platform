import express from 'express';

const router = express.Router();

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', (req, res) => {
  res.json({ message: 'Get orders' });
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', (req, res) => {
  res.json({ message: 'Create order' });
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', (req, res) => {
  res.json({ message: 'Get order by ID' });
});

export default router;
