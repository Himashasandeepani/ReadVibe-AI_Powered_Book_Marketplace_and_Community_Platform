// components/Checkout/utils.js

// Format price function (copied from helpers to avoid import issues)
export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Payment processing utilities
export const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(" ");
  } else {
    return value;
  }
};

// Form validation
export const validatePaymentForm = (paymentData) => {
  const errors = {};

  // Card number validation
  if (!paymentData.cardNumber.trim()) {
    errors.cardNumber = "Card number is required";
  } else if (paymentData.cardNumber.replace(/\s/g, "").length < 16) {
    errors.cardNumber = "Please enter a valid 16-digit card number";
  }

  // Expiration date validation
  if (!paymentData.expDate.trim()) {
    errors.expDate = "Expiration date is required";
  } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expDate)) {
    errors.expDate = "Please enter expiration date in MM/YY format";
  }

  // CVV validation
  if (!paymentData.cvv.trim()) {
    errors.cvv = "CVV is required";
  } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
    errors.cvv = "Please enter a valid 3-4 digit CVV";
  }

  // Cardholder name validation
  if (!paymentData.cardholderName.trim()) {
    errors.cardholderName = "Cardholder name is required";
  }

  return errors;
};

// Calculate estimated delivery
export const calculateEstimatedDelivery = (shippingMethod) => {
  const now = new Date();
  let daysToAdd;

  switch (shippingMethod) {
    case "express":
      daysToAdd = 3;
      break;
    case "priority":
      daysToAdd = 1;
      break;
    case "standard":
    default:
      daysToAdd = 7;
  }

  const deliveryDate = new Date(now);
  deliveryDate.setDate(now.getDate() + daysToAdd);
  return deliveryDate.toISOString();
};

// Create order object
export const createOrder = (user, orderData, paymentResult) => {
  return {
    id: "ORD" + Date.now(),
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    items: orderData.items,
    shipping: {
      ...orderData.shipping,
      shippingCost: orderData.totals.shipping,
      estimatedDelivery: calculateEstimatedDelivery(
        orderData.shipping.shippingMethod
      ),
    },
    payment: {
      method: "credit_card",
      transactionId: paymentResult.transactionId,
      amount: orderData.totals.total,
      timestamp: paymentResult.timestamp,
    },
    totals: orderData.totals,
    status: "confirmed",
    orderDate: new Date().toISOString(),
    orderNumber: "RV" + Date.now().toString().slice(-8),
  };
};

// Simulate payment processing
export const processPayment = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 90% success rate for demo
      if (Math.random() < 0.9) {
        resolve({
          success: true,
          transactionId:
            "TXN_" + Date.now() + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
        });
      } else {
        reject(
          new Error("Payment declined. Please check your card details.")
        );
      }
    }, 1500);
  });
};

// Clear checkout data from storage
export const clearCheckoutData = () => {
  localStorage.setItem("cart", JSON.stringify([]));
  sessionStorage.removeItem("deliveryData");
  sessionStorage.removeItem("checkoutCart");
  sessionStorage.removeItem("orderSummary");
};

// Save order to storage
export const saveOrderToStorage = (order) => {
  const orders = JSON.parse(localStorage.getItem("userOrders")) || [];
  orders.push(order);
  localStorage.setItem("userOrders", JSON.stringify(orders));
};