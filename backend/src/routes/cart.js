import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  addToCart,
  clearCart,
  deleteCartItem,
  getCartForUser,
  updateCartItem,
} from '../models/cartModel.js';

const router = express.Router();

const getUserId = (req) => {
  const raw = req.headers['x-user-id'] || req.query.userId || req.body.userId;
  const parsed = Number(raw);
  return Number.isInteger(parsed) ? parsed : null;
};

const requireUser = (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  req.userId = userId;
  next();
};

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// @route   GET /api/cart
// @desc    Get user cart
router.get('/', requireUser, async (req, res) => {
  try {
    const items = await getCartForUser(req.userId);
    return res.json({ items });
  } catch (err) {
    console.error('Failed to fetch cart', err);
    return res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// @route   POST /api/cart
// @desc    Add item to cart (increments if exists)
router.post(
  '/',
  requireUser,
  [
    body('bookId').isInt().withMessage('bookId is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('quantity must be positive'),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const items = await addToCart(req.userId, Number(req.body.bookId), Number(req.body.quantity) || 1);
      return res.status(201).json({ items });
    } catch (err) {
      console.error('Failed to add to cart', err);
      return res.status(500).json({ error: 'Failed to add to cart' });
    }
  }
);

// @route   PUT /api/cart/:bookId
// @desc    Update quantity for cart item (quantity <= 0 removes)
router.put(
  '/:bookId',
  requireUser,
  [
    param('bookId').isInt().withMessage('bookId must be an integer'),
    body('quantity').isInt().withMessage('quantity is required'),
  ],
  handleValidation,
  async (req, res) => {
    const quantity = Number(req.body.quantity);
    try {
      const items = await updateCartItem(req.userId, Number(req.params.bookId), quantity);
      return res.json({ items });
    } catch (err) {
      console.error('Failed to update cart item', err);
      return res.status(500).json({ error: 'Failed to update cart item' });
    }
  }
);

// @route   DELETE /api/cart/:bookId
// @desc    Remove item from cart
router.delete(
  '/:bookId',
  requireUser,
  [param('bookId').isInt().withMessage('bookId must be an integer')],
  handleValidation,
  async (req, res) => {
    try {
      await deleteCartItem(req.userId, Number(req.params.bookId));
      const items = await getCartForUser(req.userId);
      return res.json({ items });
    } catch (err) {
      console.error('Failed to remove cart item', err);
      return res.status(500).json({ error: 'Failed to remove cart item' });
    }
  }
);

// @route   DELETE /api/cart
// @desc    Clear cart
router.delete('/', requireUser, async (req, res) => {
  try {
    await clearCart(req.userId);
    return res.json({ items: [] });
  } catch (err) {
    console.error('Failed to clear cart', err);
    return res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;
