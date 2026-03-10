import { createOrder, getOrderById, getOrdersForUser } from '../models/orderModel.js';

const ensureUser = (req) => {
  if (!req.userId) {
    const err = new Error('userId is required');
    err.status = 400;
    throw err;
  }
  return req.userId;
};

export const createOrderHandler = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    const { items, shipping, shippingMethod, shippingCost } = req.body || {};

    const order = await createOrder({
      userId,
      items,
      shipping,
      shippingMethod,
      shippingCost,
    });

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
};

export const getOrdersHandler = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    const orders = await getOrdersForUser(userId);
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

export const getOrderHandler = async (req, res, next) => {
  try {
    const userId = ensureUser(req);
    const orderId = Number(req.params.id);
    const order = await getOrderById(orderId);

    if (!order || order.userId !== userId) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
};
