import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  addCartItem,
  clearCartHandler,
  deleteCartItemHandler,
  getCart,
  updateCartItemHandler,
} from '../controllers/cartController.js';

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
router.get('/', requireUser, getCart);

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
  addCartItem
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
  updateCartItemHandler
);

// @route   DELETE /api/cart/:bookId
// @desc    Remove item from cart
router.delete(
  '/:bookId',
  requireUser,
  [param('bookId').isInt().withMessage('bookId must be an integer')],
  handleValidation,
  deleteCartItemHandler
);

// @route   DELETE /api/cart
// @desc    Clear cart
router.delete('/', requireUser, clearCartHandler);

export default router;
