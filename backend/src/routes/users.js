import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  listRoles,
  listStatuses,
  updateUser,
  userExists,
} from '../models/userModel.js';

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// @route   GET /api/users
// @desc    Get all users (Admin)
// @access  Public for now (hook up auth middleware when JWT is enabled)
router.get('/', async (_req, res) => {
  try {
    const users = await getAllUsers();
    return res.json({ users });
  } catch (err) {
    console.error('Failed to fetch users', err);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// @route   GET /api/users/roles
// @desc    List available roles
router.get('/roles', async (_req, res) => {
  try {
    const roles = await listRoles();
    return res.json({ roles });
  } catch (err) {
    console.error('Failed to fetch roles', err);
    return res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// @route   GET /api/users/statuses
// @desc    List available statuses
router.get('/statuses', async (_req, res) => {
  try {
    const statuses = await listStatuses();
    return res.json({ statuses });
  } catch (err) {
    console.error('Failed to fetch statuses', err);
    return res.status(500).json({ error: 'Failed to fetch statuses' });
  }
});

// @route   GET /api/users/:id
// @desc    Get single user by id
router.get(
  '/:id',
  [param('id').isInt().withMessage('User id must be an integer')],
  handleValidation,
  async (req, res) => {
    try {
      const user = await getUserById(Number(req.params.id));
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json({ user });
    } catch (err) {
      console.error('Failed to fetch user', err);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
  }
);

// @route   POST /api/users
// @desc    Create a new user
router.post(
  '/',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').optional().isString(),
    body('status').optional().isString(),
    body('fullName').optional().isString(),
    body('termsAccepted').optional().isBoolean(),
    body('aiEmailOptIn').optional().isBoolean(),
  ],
  handleValidation,
  async (req, res) => {
    const { fullName, email, username, password, role, status, termsAccepted, aiEmailOptIn } = req.body;

    try {
      const exists = await userExists(username, email);
      if (exists) {
        return res.status(409).json({ error: 'Username or email already exists' });
      }

      const user = await createUser({
        fullName: fullName || username,
        email,
        username,
        password,
        role,
        status,
        termsAccepted,
        aiEmailOptIn,
      });

      return res.status(201).json({ user });
    } catch (err) {
      console.error('Failed to create user', err);
      return res.status(500).json({ error: 'Failed to create user' });
    }
  }
);

// @route   PUT /api/users/:id
// @desc    Update an existing user
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('User id must be an integer'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('username').optional().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').optional().isString(),
    body('status').optional().isString(),
    body('fullName').optional().isString(),
    body('termsAccepted').optional().isBoolean(),
    body('aiEmailOptIn').optional().isBoolean(),
  ],
  handleValidation,
  async (req, res) => {
    const userId = Number(req.params.id);
    const updates = req.body || {};

    try {
      const existingUser = await getUserById(userId);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const duplicate = await userExists(updates.username, updates.email, userId);
      if (duplicate) {
        return res.status(409).json({ error: 'Username or email already exists' });
      }

      const user = await updateUser(userId, updates);
      return res.json({ user });
    } catch (err) {
      console.error('Failed to update user', err);
      return res.status(500).json({ error: 'Failed to update user' });
    }
  }
);

// @route   DELETE /api/users/:id
// @desc    Delete user
router.delete(
  '/:id',
  [param('id').isInt().withMessage('User id must be an integer')],
  handleValidation,
  async (req, res) => {
    const userId = Number(req.params.id);

    try {
      const existingUser = await getUserById(userId);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      await deleteUser(userId);
      return res.json({ success: true });
    } catch (err) {
      console.error('Failed to delete user', err);
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  }
);

export default router;
