import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  createOrderHandler,
  getOrderHandler,
  getOrdersHandler,
} from '../controllers/orderController.js';

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

// @route   GET /api/orders
// @desc    Get user orders
router.get('/', requireUser, getOrdersHandler);

// @route   POST /api/orders
// @desc    Create new order
router.post(
  '/',
  requireUser,
  [
    body('items').isArray({ min: 1 }).withMessage('items array is required'),
    body('items.*.bookId').isInt().withMessage('bookId must be an integer'),
    body('items.*.quantity').optional().isInt({ min: 1 }).withMessage('quantity must be at least 1'),
    body('shippingMethod').optional().isString(),
    body('shippingCost').optional().isNumeric(),
  ],
  handleValidation,
  createOrderHandler
);

// @route   GET /api/orders/:id
// @desc    Get order by ID
router.get(
  '/:id',
  requireUser,
  [param('id').isInt().withMessage('Order id must be an integer')],
  handleValidation,
  getOrderHandler
);

export default router;
