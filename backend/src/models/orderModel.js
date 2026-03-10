import { query } from '../config/database.js';

const ensureTables = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      shipping_method TEXT,
      shipping_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
      tax NUMERIC(12, 2) NOT NULL DEFAULT 0,
      subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
      total NUMERIC(12, 2) NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'LKR',
      shipping_address JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id BIGSERIAL PRIMARY KEY,
      order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
      book_id BIGINT REFERENCES books(id) ON DELETE SET NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
      line_total NUMERIC(12, 2) NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
};

ensureTables().catch((err) => console.error('Failed to ensure orders tables', err));

const mapOrder = (row) => ({
  id: row.id,
  userId: row.user_id,
  status: row.status,
  shippingMethod: row.shipping_method,
  shippingCost: Number(row.shipping_cost) || 0,
  tax: Number(row.tax) || 0,
  subtotal: Number(row.subtotal) || 0,
  total: Number(row.total) || 0,
  currency: row.currency,
  shippingAddress: row.shipping_address || {},
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapItem = (row) => ({
  id: row.id,
  orderId: row.order_id,
  bookId: row.book_id,
  quantity: row.quantity,
  unitPrice: Number(row.unit_price) || 0,
  lineTotal: Number(row.line_total) || 0,
  title: row.title,
  image: row.image,
});

const getOrderItems = async (orderId) => {
  const { rows } = await query(
    `SELECT oi.*, b.title, b.image
     FROM order_items oi
     LEFT JOIN books b ON oi.book_id = b.id
     WHERE oi.order_id = $1
     ORDER BY oi.id ASC`,
    [orderId]
  );
  return rows.map(mapItem);
};

export const getOrderById = async (orderId) => {
  const { rows } = await query('SELECT * FROM orders WHERE id = $1 LIMIT 1', [orderId]);
  if (!rows[0]) return null;
  const order = mapOrder(rows[0]);
  const items = await getOrderItems(orderId);
  return { ...order, items };
};

export const getOrdersForUser = async (userId) => {
  const { rows } = await query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  const orders = [];
  for (const row of rows) {
    const order = mapOrder(row);
    const items = await getOrderItems(row.id);
    orders.push({ ...order, items });
  }
  return orders;
};

export const createOrder = async ({
  userId,
  items,
  shipping,
  shippingMethod,
  shippingCost = 0,
}) => {
  if (!userId) {
    const err = new Error('userId is required');
    err.status = 400;
    throw err;
  }
  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error('At least one item is required');
    err.status = 400;
    throw err;
  }

  const bookIds = items.map((i) => Number(i.bookId)).filter(Boolean);
  const { rows: bookRows } = await query(
    'SELECT id, price, title, image FROM books WHERE id = ANY($1)',
    [bookIds]
  );
  const booksById = new Map(bookRows.map((b) => [Number(b.id), b]));

  const missing = bookIds.filter((id) => !booksById.has(id));
  if (missing.length) {
    const err = new Error(`Books not found: ${missing.join(', ')}`);
    err.status = 400;
    throw err;
  }

  const computedItems = items.map((item) => {
    const book = booksById.get(Number(item.bookId));
    const quantity = Math.max(1, Number(item.quantity) || 1);
    const unitPrice = Number(book.price) || 0;
    const lineTotal = Number((unitPrice * quantity).toFixed(2));
    return {
      bookId: Number(item.bookId),
      quantity,
      unitPrice,
      lineTotal,
      title: book.title,
      image: book.image,
    };
  });

  const subtotal = computedItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const shippingCostValue = Number(shippingCost) || 0;
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + shippingCostValue + tax).toFixed(2));

  const address = shipping ? { ...shipping } : null;

  const { rows } = await query(
    `INSERT INTO orders (
       user_id, status, shipping_method, shipping_cost, tax, subtotal, total, currency, shipping_address
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id`,
    [userId, 'pending', shippingMethod || null, shippingCostValue, tax, subtotal, total, 'LKR', address]
  );

  const orderId = rows[0].id;

  const insertItems = computedItems.map((item) =>
    query(
      `INSERT INTO order_items (order_id, book_id, quantity, unit_price, line_total)
       VALUES ($1, $2, $3, $4, $5)`,
      [orderId, item.bookId, item.quantity, item.unitPrice, item.lineTotal]
    )
  );
  await Promise.all(insertItems);

  // Clear cart for this user to keep states consistent
  await query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

  return getOrderById(orderId);
};
