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

export const getUsers = async (_req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await getUserById(Number(req.params.id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const createUserHandler = async (req, res, next) => {
  try {
    const { fullName, email, username, password, role, status, termsAccepted, aiEmailOptIn } = req.body;

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

    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

export const updateUserHandler = async (req, res, next) => {
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
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const deleteUserHandler = async (req, res, next) => {
  const userId = Number(req.params.id);
  try {
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    await deleteUser(userId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const getRoles = async (_req, res, next) => {
  try {
    const roles = await listRoles();
    res.json({ roles });
  } catch (err) {
    next(err);
  }
};

export const getStatuses = async (_req, res, next) => {
  try {
    const statuses = await listStatuses();
    res.json({ statuses });
  } catch (err) {
    next(err);
  }
};
