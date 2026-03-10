import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  addWishlist,
  clearWishlistHandler,
  deleteWishlist,
  getWishlist,
  updateWishlist,
} from '../controllers/wishlistController.js';

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

// @route   GET /api/wishlist
router.get('/', requireUser, getWishlist);

// @route   POST /api/wishlist
router.post(
  '/',
  requireUser,
  [
    body('bookId').isInt().withMessage('bookId is required'),
    body('priority').optional().isInt({ min: 1, max: 5 }).withMessage('priority must be 1-5'),
    body('notes').optional().isString(),
  ],
  handleValidation,
  addWishlist
);

// @route   PUT /api/wishlist/:bookId
router.put(
  '/:bookId',
  requireUser,
  [
    param('bookId').isInt().withMessage('bookId must be an integer'),
    body('priority').optional().isInt({ min: 1, max: 5 }).withMessage('priority must be 1-5'),
    body('notes').optional().isString(),
  ],
  handleValidation,
  updateWishlist
);

// @route   DELETE /api/wishlist/:bookId
router.delete(
  '/:bookId',
  requireUser,
  [param('bookId').isInt().withMessage('bookId must be an integer')],
  handleValidation,
  deleteWishlist
);

// @route   DELETE /api/wishlist
router.delete('/', requireUser, clearWishlistHandler);

export default router;
