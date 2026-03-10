import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';

// Ensure the users table exists. This runs once on import.
const ensureTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

ensureTable().catch((err) => {
  console.error('Failed to ensure users table', err);
});

export const findByUsernameOrEmail = async (identifier) => {
  const { rows } = await query(
    'SELECT id, name, email, username, password_hash, role, created_at FROM users WHERE username = $1 OR email = $1 LIMIT 1',
    [identifier]
  );
  return rows[0] || null;
};

export const userExists = async (username, email) => {
  const { rows } = await query(
    'SELECT 1 FROM users WHERE username = $1 OR email = $2 LIMIT 1',
    [username, email]
  );
  return rows.length > 0;
};

export const createUser = async ({ name, email, username, password, role = 'user' }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const { rows } = await query(
    `INSERT INTO users (name, email, username, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, username, role, created_at`,
    [name, email, username, passwordHash, role]
  );
  return rows[0];
};

export const verifyUser = async (identifier, password) => {
  const user = await findByUsernameOrEmail(identifier);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) return null;

  const { password_hash, ...safeUser } = user;
  return safeUser;
};
