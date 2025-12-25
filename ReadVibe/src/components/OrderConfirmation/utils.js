// Format price helper
import { formatPrice, formatDate } from "../../utils/helpers";

// Shipping methods configuration
export const shippingMethods = {
  standard: {
    id: "standard",
    title: "Standard Shipping",
    description: "Economical shipping for standard delivery. Tracking available.",
    days: "5-7 business days",
    processingDays: 2,
    shippingDays: 5,
    icon: "truck",
    price: 500.0,
  },
  express: {
    id: "express",
    title: "Express Shipping",
    description: "Priority shipping with expedited delivery. Includes tracking and insurance.",
    days: "2-3 business days",
    processingDays: 1,
    shippingDays: 2,
    icon: "shippingFast",
    price: 1200.0,
  },
  overnight: {
    id: "overnight",
    title: "Overnight Shipping",
    description: "Guaranteed overnight delivery. Includes premium tracking and full insurance.",
    days: "Next business day",
    processingDays: 0,
    shippingDays: 1,
    icon: "rocket",
    price: 2500.0,
  },
};

// Get order by ID
export const getOrderById = (orderId) => {
  const orders = JSON.parse(localStorage.getItem("userOrders")) || [];
  return orders.find((order) => order.id === orderId);
};

// Get latest user order
export const getLatestUserOrder = () => {
  const user = getCurrentUser();
  if (!user) return null;

  const orders = JSON.parse(localStorage.getItem("userOrders")) || [];
  const userOrders = orders.filter((order) => order.userId === user.id);

  if (userOrders.length === 0) return null;
  return userOrders[userOrders.length - 1];
};

// Get tracking updates
export const getTrackingUpdates = (orderId) => {
  const allUpdates = JSON.parse(localStorage.getItem("orderTrackingUpdates")) || [];
  return allUpdates.filter((update) => update.orderId === orderId);
};

// Get ordered categories
export const getOrderedCategories = (order, books) => {
  if (!order || !order.items || !books) return [];

  const categories = [];
  order.items.forEach((item) => {
    const book = books.find((b) => b.id === item.id);
    if (book && book.category && !categories.includes(book.category)) {
      categories.push(book.category);
    }
  });

  return categories;
};

// Get recommended books
export const getRecommendedBooks = (categories, books, limit = 4) => {
  if (!categories || categories.length === 0 || !books) {
    return books.slice(0, limit);
  }

  const recommended = [];

  categories.forEach((category) => {
    const categoryBooks = books.filter(
      (book) =>
        book.category === category &&
        !recommended.some((rec) => rec.id === book.id)
    );

    recommended.push(...categoryBooks.slice(0, 2));

    if (recommended.length >= limit) {
      return recommended.slice(0, limit);
    }
  });

  if (recommended.length < limit) {
    const remaining = limit - recommended.length;
    const popularBooks = books
      .filter((book) => !recommended.some((rec) => rec.id === book.id))
      .slice(0, remaining);
    recommended.push(...popularBooks);
  }

  return recommended.slice(0, limit);
};

// Calculate estimated dates
export const calculateEstimatedDates = (shippingMethodKey) => {
  const now = new Date();
  const method = shippingMethods[shippingMethodKey] || shippingMethods.standard;

  const processingDays = method.processingDays || 2;
  const shippingDays = method.shippingDays || 7;

  const shipDate = new Date(now);
  shipDate.setDate(now.getDate() + processingDays);

  const deliveryDate = new Date(now);
  deliveryDate.setDate(now.getDate() + processingDays + shippingDays);

  return {
    shipDate: shipDate.toLocaleDateString(),
    deliveryDate: deliveryDate.toLocaleDateString(),
    processingDays,
    shippingDays,
  };
};

// Generate invoice content
export const generateInvoiceContent = (order, user, trackingUpdates = []) => {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const method = shippingMethods[order.shipping?.shippingMethod] || shippingMethods.standard;

  let invoiceText = "============================================\n";
  invoiceText += "              READVIBE INVOICE\n";
  invoiceText += "============================================\n\n";

  invoiceText += `Invoice No: ${order.orderNumber || order.id}\n`;
  invoiceText += `Date: ${date}\n`;
  invoiceText += `Customer: ${user.name}\n`;
  invoiceText += `Email: ${user.email}\n\n`;

  if (order.shipping) {
    invoiceText += "Shipping Address:\n";
    invoiceText += `${order.shipping.firstName} ${order.shipping.lastName}\n`;
    invoiceText += `${order.shipping.address}\n`;
    invoiceText += `${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}\n`;
    invoiceText += `${order.shipping.country}\n\n`;
  }

  invoiceText += "============================================\n";
  invoiceText += "Order Items\n";
  invoiceText += "============================================\n\n";

  order.items?.forEach((item, index) => {
    invoiceText += `${index + 1}. ${item.title}\n`;
    invoiceText += `   by ${item.author}\n`;
    invoiceText += `   Qty: ${item.quantity} x ${formatPrice(item.price)}\n`;
    invoiceText += `   Total: ${formatPrice(item.price * item.quantity)}\n\n`;
  });

  invoiceText += "============================================\n";
  invoiceText += "Order Summary\n";
  invoiceText += "============================================\n\n";

  if (order.totals) {
    invoiceText += `Subtotal: ${formatPrice(order.totals.subtotal)}\n`;
    invoiceText += `Shipping: ${formatPrice(order.totals.shipping)}\n`;
    invoiceText += `Tax (5%): ${formatPrice(order.totals.tax)}\n`;
    invoiceText += `Total: ${formatPrice(order.totals.total)}\n\n`;
  }

  invoiceText += "Payment Information:\n";
  invoiceText += `Method: ${order.payment?.method || "Credit Card"}\n`;
  invoiceText += `Transaction ID: ${order.payment?.transactionId || "N/A"}\n\n`;

  invoiceText += "Shipping Information:\n";
  invoiceText += `Method: ${method.title}\n`;
  invoiceText += `Delivery Time: ${method.days}\n`;
  invoiceText += `Cost: ${formatPrice(order.totals?.shipping || 0)}\n\n`;

  if (trackingUpdates.length > 0) {
    invoiceText += "Tracking Information:\n";
    trackingUpdates.forEach((update) => {
      invoiceText += `${formatDate(update.timestamp)} - ${update.status}\n`;
      if (update.note) invoiceText += `  Note: ${update.note}\n`;
    });
    invoiceText += "\n";
  }

  invoiceText += "============================================\n";
  invoiceText += "Thank you for shopping with ReadVibe!\n";
  invoiceText += "============================================\n\n";

  invoiceText += "Customer Support:\n";
  invoiceText += "Email: support@readvibe.com\n";
  invoiceText += "Phone: +94 11 234 5678\n";
  invoiceText += "Hours: Mon-Fri 9:00 AM - 6:00 PM\n";

  return invoiceText;
};

// Download invoice
export const downloadInvoice = (order, user, trackingUpdates = []) => {
  if (!user || !order) return false;

  try {
    const invoiceContent = generateInvoiceContent(order, user, trackingUpdates);
    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice_${order.orderNumber || order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Error downloading invoice:", error);
    return false;
  }
};

// Add support request
export const addSupportRequest = (order, user, message) => {
  const supportRequests = JSON.parse(localStorage.getItem("supportRequests")) || [];

  const newRequest = {
    id: Date.now(),
    orderId: order.id,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    message: message.trim(),
    status: "pending",
    timestamp: new Date().toISOString(),
    responses: [],
  };

  supportRequests.push(newRequest);
  localStorage.setItem("supportRequests", JSON.stringify(supportRequests));
  return newRequest;
};

export { formatPrice, formatDate };