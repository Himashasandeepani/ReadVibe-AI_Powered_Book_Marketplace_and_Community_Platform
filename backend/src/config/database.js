import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // prefer single URL when provided
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'readvibe_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: Number(process.env.DB_POOL_MAX) || 10,
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS) || 30000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => console.log('Connected to PostgreSQL database'));
pool.on('error', (err) => console.error('Unexpected error on idle client', err));

// Fail fast if the database is unreachable at startup.
const testConnection = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Database connection verified');
  } catch (err) {
    console.error('Database connection failed', err);
    process.exit(1);
  }
};

testConnection();

export const query = (text, params) => pool.query(text, params);
export default pool;