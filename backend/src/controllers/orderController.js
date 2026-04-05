import { createOrder, getAllOrders, getOrderById, getOrdersForUser, updateOrderStatus } from '../models/orderModel.js';
import { getUserById } from '../models/userModel.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';

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

    const user = await getUserById(userId);
    if (user?.email) {
      sendOrderConfirmationEmail({
        to: shipping?.email || user.email,
        customerName: shipping?.firstName
          ? `${shipping.firstName} ${shipping.lastName || ''}`.trim()
          : user.name,
        order,
      }).catch((error) => {
        console.error('Failed to send order confirmation email', error);
      });
    }

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

export const getAllOrdersHandler = async (_req, res, next) => {
  try {
    const orders = await getAllOrders();
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

export const updateOrderStatusHandler = async (req, res, next) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body || {};
    const order = await updateOrderStatus(orderId, status);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
};
