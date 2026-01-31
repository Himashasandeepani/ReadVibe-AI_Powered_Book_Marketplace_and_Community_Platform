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

export const getSupplierStatusClass = (status) => {
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
export const initialStockBooks = () => {
  return [
    {
      id: 1,
      isbn: "978-0525559474",
      title: "The Midnight Library",
      author: "Matt Haig",
      category: "Fiction",
      price: 325 * 24.99,
      costPrice: 325 * 15.0,
      stock: 15,
      minStock: 5,
      maxStock: 50,
      status: "In Stock",
      publisher: "Penguin Books",
      publicationYear: 2020,
      pages: 304,
      lastRestocked: "2024-01-15",
      salesThisMonth: 8,
      totalSales: 45,
      featured: true,
    },
    {
      id: 2,
      isbn: "978-0593135204",
      title: "Project Hail Mary",
      author: "Andy Weir",
      category: "Science Fiction",
      price: 325 * 27.99,
      costPrice: 325 * 18.0,
      stock: 8,
      minStock: 5,
      maxStock: 40,
      status: "In Stock",
      publisher: "Ballantine Books",
      publicationYear: 2021,
      pages: 476,
      lastRestocked: "2024-01-10",
      salesThisMonth: 12,
      totalSales: 67,
      featured: true,
    },
    {
      id: 3,
      isbn: "978-0441172719",
      title: "Dune",
      author: "Frank Herbert",
      category: "Science Fiction",
      price: 325 * 22.99,
      costPrice: 325 * 14.0,
      stock: 3,
      minStock: 5,
      maxStock: 30,
      status: "Low Stock",
      publisher: "Ace Books",
      publicationYear: 1965,
      pages: 412,
      lastRestocked: "2023-12-20",
      salesThisMonth: 5,
      totalSales: 89,
      featured: true,
    },
    {
      id: 4,
      isbn: "978-0547928227",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      category: "Fantasy",
      price: 325 * 18.99,
      costPrice: 325 * 12.0,
      stock: 0,
      minStock: 5,
      maxStock: 25,
      status: "Out of Stock",
      publisher: "Houghton Mifflin",
      publicationYear: 1937,
      pages: 310,
      lastRestocked: "2023-11-05",
      salesThisMonth: 3,
      totalSales: 56,
      featured: false,
    },
    {
      id: 5,
      isbn: "978-1250217288",
      title: "The Silent Patient",
      author: "Alex Michaelides",
      category: "Mystery",
      price: 325 * 21.99,
      costPrice: 325 * 13.5,
      stock: 12,
      minStock: 5,
      maxStock: 35,
      status: "In Stock",
      publisher: "Celadon Books",
      publicationYear: 2019,
      pages: 336,
      lastRestocked: "2024-01-05",
      salesThisMonth: 7,
      totalSales: 34,
      featured: false,
    },
    {
      id: 6,
      isbn: "978-0735219090",
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      category: "Fiction",
      price: 325 * 26.99,
      costPrice: 325 * 16.0,
      stock: 20,
      minStock: 5,
      maxStock: 45,
      status: "In Stock",
      publisher: "G.P. Putnam's Sons",
      publicationYear: 2018,
      pages: 384,
      lastRestocked: "2024-01-12",
      salesThisMonth: 15,
      totalSales: 78,
      featured: true,
    },
  ];
};

export const initialStockOrders = () => {
  return [
    {
      id: "ORD001",
      customer: "John Doe",
      customerEmail: "john@example.com",
      items: 2,
      total: 325 * 52.98,
      status: "Processing",
      orderDate: "2024-01-20",
      shippingAddress: "123 Main St, Colombo",
      paymentMethod: "Credit Card",
      trackingNumber: "TRK789456123",
      courier: "Aramex",
      estimatedDelivery: "2024-01-27",
    },
    {
      id: "ORD002",
      customer: "Sarah Johnson",
      customerEmail: "sarah@example.com",
      items: 1,
      total: 325 * 24.99,
      status: "Shipped",
      orderDate: "2024-01-19",
      shippingAddress: "456 Park Ave, Kandy",
      paymentMethod: "PayPal",
      trackingNumber: "TRK321654987",
      courier: "DHL",
      estimatedDelivery: "2024-01-25",
    },
    {
      id: "ORD003",
      customer: "Michael Brown",
      customerEmail: "michael@example.com",
      items: 3,
      total: 325 * 68.97,
      status: "Delivered",
      orderDate: "2024-01-18",
      shippingAddress: "789 Beach Rd, Galle",
      paymentMethod: "Credit Card",
      trackingNumber: "TRK147258369",
      courier: "FedEx",
      deliveryDate: "2024-01-23",
    },
  ];
};

export const initialSuppliers = () => {
  return [
    {
      id: "SUP001",
      name: "Book Distributors Inc.",
      contact: "John Smith",
      email: "john@bookdist.com",
      phone: "+94 11 234 5678",
      address: "123 Business Ave, Colombo 05",
      website: "www.bookdist.com",
      booksSupplied: 45,
      status: "Active",
      rating: 4.5,
      paymentTerms: "30 days",
      leadTime: "5-7 days",
      lastOrder: "2024-01-15",
    },
    {
      id: "SUP002",
      name: "Global Publishers Ltd.",
      contact: "Sarah Johnson",
      email: "sarah@globalpub.com",
      phone: "+94 11 345 6789",
      address: "456 Commerce St, Colombo 03",
      website: "www.globalpub.com",
      booksSupplied: 32,
      status: "Active",
      rating: 4.2,
      paymentTerms: "45 days",
      leadTime: "7-10 days",
      lastOrder: "2024-01-10",
    },
    {
      id: "SUP003",
      name: "Literary Works Co.",
      contact: "Michael Brown",
      email: "michael@literaryworks.com",
      phone: "+94 11 456 7890",
      address: "789 Trade Rd, Colombo 07",
      website: "www.literaryworks.com",
      booksSupplied: 18,
      status: "Inactive",
      rating: 3.8,
      paymentTerms: "15 days",
      leadTime: "10-14 days",
      lastOrder: "2023-12-20",
    },
  ];
};

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