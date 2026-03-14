import { query } from '../config/database.js';

const ensureTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS publishers (
      publisher_id BIGSERIAL PRIMARY KEY,
      publisher_name VARCHAR(200),
      email VARCHAR(255),
      phone VARCHAR(30),
      address TEXT,
      status_id BIGINT REFERENCES status(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
};

ensureTable().catch((err) => console.error('Failed to ensure publishers table', err));

const mapRow = (row) => ({
  id: row.publisher_id,
  name: row.publisher_name,
  email: row.email,
  phone: row.phone,
  address: row.address,
  statusId: row.status_id,
  createdAt: row.created_at,
});

export const listPublishers = async () => {
  const { rows } = await query(
    'SELECT publisher_id, publisher_name, email, phone, address, status_id, created_at FROM publishers ORDER BY publisher_name ASC'
  );
  return rows.map(mapRow);
};

export const getPublisherById = async (id) => {
  const { rows } = await query(
    'SELECT publisher_id, publisher_name, email, phone, address, status_id, created_at FROM publishers WHERE publisher_id = $1 LIMIT 1',
    [id]
  );
  if (!rows[0]) return null;
  return mapRow(rows[0]);
};

export const createPublisher = async ({ name, email, phone, address }) => {
  const { rows } = await query(
    `INSERT INTO publishers (publisher_name, email, phone, address)
     VALUES ($1, $2, $3, $4)
     RETURNING publisher_id`,
    [name, email || null, phone || null, address || null]
  );
  return getPublisherById(rows[0].publisher_id);
};

export const updatePublisher = async (id, updates = {}) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.name !== undefined) {
    fields.push(`publisher_name = $${idx++}`);
    values.push(updates.name);
  }
  if (updates.email !== undefined) {
    fields.push(`email = $${idx++}`);
    values.push(updates.email);
  }
  if (updates.phone !== undefined) {
    fields.push(`phone = $${idx++}`);
    values.push(updates.phone);
  }
  if (updates.address !== undefined) {
    fields.push(`address = $${idx++}`);
    values.push(updates.address);
  }

  if (!fields.length) {
    return getPublisherById(id);
  }

  values.push(id);

  await query(
    `UPDATE publishers SET ${fields.join(', ')} WHERE publisher_id = $${idx}`,
    values
  );

  return getPublisherById(id);
};

export const deletePublisher = async (id) => {
  await query('DELETE FROM publishers WHERE publisher_id = $1', [id]);
};
