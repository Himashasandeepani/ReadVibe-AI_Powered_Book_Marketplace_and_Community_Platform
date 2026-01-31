// User management utility functions
// utils/auth.js
export const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
  // Trigger storage event for other tabs
  window.dispatchEvent(new Event('storage'));
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

export const isStockManager = () => {
  const user = getCurrentUser();
  return user && user.role === 'stock';
};

export const isRegularUser = () => {
  const user = getCurrentUser();
  return user && user.role === 'user';
};



export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};
// cart 

// ... existing code ...

// Cart functions
export const getCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const updateCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const addToCart = (bookId, quantity = 1) => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === bookId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: bookId,
      quantity: quantity,
      addedAt: new Date().toISOString()
    });
  }

  updateCart(cart);
  return cart;
};

export const removeFromCart = (bookId) => {
  const cart = getCart();
  const newCart = cart.filter(item => item.id !== bookId);
  updateCart(newCart);
  return newCart;
};

export const updateCartQuantity = (bookId, change) => {
  const cart = getCart();
  const newCart = cart.map(item => {
    if (item.id === bookId) {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        return null; // Will be filtered out
      }
      return { ...item, quantity: newQuantity };
    }
    return item;
  }).filter(Boolean);

  updateCart(newCart);
  return newCart;
};

export const clearCart = () => {
  updateCart([]);
  return [];
};

export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};



// checkout
// ... existing code ...

// Checkout functions
export const getDeliveryData = () => {
  const data = sessionStorage.getItem('deliveryData');
  return data ? JSON.parse(data) : null;
};

export const saveDeliveryData = (data) => {
  sessionStorage.setItem('deliveryData', JSON.stringify(data));
};

export const clearDeliveryData = () => {
  sessionStorage.removeItem('deliveryData');
};

export const getOrderSummary = () => {
  const summary = sessionStorage.getItem('orderSummary');
  return summary ? JSON.parse(summary) : null;
};

export const saveOrder = (order) => {
  const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
  orders.push(order);
  localStorage.setItem('userOrders', JSON.stringify(orders));
  return order;
};

export const getUserOrders = () => {
  const orders = localStorage.getItem('userOrders');
  return orders ? JSON.parse(orders) : [];
};

export const getOrderById = (orderId) => {
  const orders = getUserOrders();
  return orders.find(order => order.id === orderId);
};

