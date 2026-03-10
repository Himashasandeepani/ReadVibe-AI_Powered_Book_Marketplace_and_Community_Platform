import express from 'express';
import { body, validationResult } from 'express-validator';
import { createUser, userExists, verifyUser } from '../models/userModel.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, username, password } = req.body;

    try {
      const exists = await userExists(username, email);
      if (exists) {
        return res.status(409).json({ error: 'Username or email already exists' });
      }

      const user = await createUser({ name, email, username, password });
      return res.status(201).json({ user });
    } catch (err) {
      console.error('Register error:', err);
      return res.status(500).json({ error: 'Failed to register user' });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    body('identifier').trim().notEmpty().withMessage('Username or email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { identifier, password } = req.body;

    try {
      const user = await verifyUser(identifier, password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      return res.json({ user });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Failed to login' });
    }
  }
);

// @route   POST /api/auth/logout
// @desc    Logout user (placeholder for future token blacklisting)
// @access  Public
router.post('/logout', (_req, res) => {
  res.json({ message: 'Logged out' });
});

export default router;
