const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const handleApi = async (path, options = {}) => {
  // Spread options first so our merged headers are not overwritten by options.headers
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || data?.message || "Request failed";
    throw new Error(msg);
  }
  return data;
};

export const createOrderApi = async (payload) => {
  if (!payload?.userId) throw new Error("userId is required to create an order");

  const body = {
    userId: payload.userId,
    items: payload.items,
    shipping: payload.shipping,
    shippingMethod: payload.shippingMethod,
    shippingCost: payload.shippingCost,
  };

  const data = await handleApi(`/api/orders`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "x-user-id": payload.userId,
    },
  });

  return data.order;
};

export const getOrdersApi = async (userId) => {
  const data = await handleApi(`/api/orders?userId=${encodeURIComponent(userId)}`, {
    headers: {
      "x-user-id": userId,
    },
  });
  return data.orders || [];
};

export const getOrderApi = async (userId, orderId) => {
  const data = await handleApi(`/api/orders/${orderId}?userId=${encodeURIComponent(userId)}`, {
    headers: {
      "x-user-id": userId,
    },
  });
  return data.order;
};
