const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const handleApi = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || data?.message || "Request failed";
    throw new Error(msg);
  }
  return data;
};

export const fetchBooksFromApi = async () => {
  const data = await handleApi("/api/books");
  return data.books || [];
};

export const createBookApi = async (payload) => {
  const data = await handleApi("/api/books", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.book;
};

export const updateBookApi = async (bookId, payload) => {
  const data = await handleApi(`/api/books/${bookId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.book;
};

export const deleteBookApi = async (bookId) => {
  await handleApi(`/api/books/${bookId}`, { method: "DELETE" });
  return true;
};

// Currency formatter for LKR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper function to convert USD to LKR (approximate rate)
export const usdToLkr = (usd) => usd * 325;

// Stock status helper functions
export const getStockStatusClass = (status) => {
  const classes = {
    "In Stock": "badge bg-success",
    "Low Stock": "badge bg-warning text-dark",
    "Out of Stock": "badge bg-danger",
  };
  return classes[status] || "badge bg-secondary";
};

export const getOrderStatusClass = (status) => {
  const classes = {
    Processing: "badge bg-warning text-dark",
    Shipped: "badge bg-info text-dark",
    Delivered: "badge bg-success",
    "Out for Delivery": "badge bg-primary",
    Returned: "badge bg-dark",
  };
  return classes[status] || "badge bg-secondary";
};

export const getRequestStatusClass = (status) => {
  const classes = {
    Pending: "badge bg-warning text-dark",
    Approved: "badge bg-success",
    Rejected: "badge bg-danger",
    Fulfilled: "badge bg-info text-dark",
  };
  return classes[status] || "badge bg-secondary";
};

export const getPublisherStatusClass = (status) => {
  return status === "Active" ? "badge bg-success" : "badge bg-secondary";
};

// Calculate stock percentage
export const getStockPercentage = (book) => {
  return (book.stock / book.maxStock) * 100;
};

// Filter books by search query
export const filterBooks = (books, searchQuery) => {
  if (!searchQuery) return books;

  const query = searchQuery.toLowerCase();
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.isbn.includes(query) ||
      book.category.toLowerCase().includes(query)
  );
};

// Sort books
export const sortBooks = (books, sortConfig) => {
  if (!sortConfig.key) return books;

  return [...books].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });
};

// Calculate statistics
export const calculateInventoryStats = (stockBooks) => {
  return {
    totalBooks: stockBooks.length,
    inStockBooks: stockBooks.filter((book) => book.status === "In Stock").length,
    lowStockBooks: stockBooks.filter((book) => book.status === "Low Stock").length,
    outOfStockBooks: stockBooks.filter((book) => book.status === "Out of Stock").length,
    lowStockItems: stockBooks.filter((book) => book.stock <= book.minStock && book.stock > 0).length,
    totalStockValue: stockBooks.reduce((sum, book) => sum + book.price * book.stock, 0),
    totalCostValue: stockBooks.reduce((sum, book) => sum + book.costPrice * book.stock, 0),
    potentialProfit: stockBooks.reduce((sum, book) => sum + (book.price - book.costPrice) * book.stock, 0),
    featuredBooks: stockBooks.filter((book) => book.featured).length,
    totalMonthlySales: stockBooks.reduce((sum, book) => sum + book.salesThisMonth, 0),
  };
};

export const calculateOrderStats = (stockOrders) => {
  return {
    total: stockOrders.length,
    processing: stockOrders.filter((order) => order.status === "Processing").length,
    shipped: stockOrders.filter((order) => order.status === "Shipped").length,
    delivered: stockOrders.filter((order) => order.status === "Delivered").length,
    totalRevenue: stockOrders.reduce((sum, order) => sum + order.total, 0),
    avgOrderValue: stockOrders.length > 0
      ? stockOrders.reduce((sum, order) => sum + order.total, 0) / stockOrders.length
      : 0,
  };
};

export const calculateRequestStats = (bookRequests) => {
  return {
    total: bookRequests.length,
    pending: bookRequests.filter((req) => req.status === "Pending").length,
    approved: bookRequests.filter((req) => req.status === "Approved").length,
    rejected: bookRequests.filter((req) => req.status === "Rejected").length,
    fulfilled: bookRequests.filter((req) => req.status === "Fulfilled").length,
  };
};

// Show notification
export const showNotification = (message, type) => {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `alert alert-${type} position-fixed`;
  notification.style.cssText = `
      top: 80px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
};

// Initial data
export const initialStockBooks = () => [];

export const initialStockOrders = () => [];

export const initialPublishers = () => [];

// Format price
export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Calculate stock alert color
export const getStockAlertColor = (stock, minStock) => {
  if (stock === 0) return "danger";
  if (stock <= minStock) return "warning";
  return "success";
};