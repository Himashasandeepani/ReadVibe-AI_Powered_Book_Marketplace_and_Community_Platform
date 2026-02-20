import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pages/StockManager.css";

// Import Components
import StockManagerHeader from "../components/common/StockManagerHeader";
import StockManagerFooter from "../components/common/StockManagerFooter";
import Sidebar from "../components/StockManager/Sidebar";
import DashboardTab from "../components/StockManager/Tabs/DashboardTab";
import InventoryTab from "../components/StockManager/Tabs/InventoryTab";
import OrdersTab from "../components/StockManager/Tabs/OrdersTab";
import ReportsTab from "../components/StockManager/Tabs/ReportsTab";
import PublishersTab from "../components/StockManager/Tabs/PublishersTab";
import BookRequestsTab from "../components/StockManager/Tabs/BookRequestsTab";
import PopularBooksTab from "../components/StockManager/Tabs/PopularBooksTab";
import AddBookModal, {
  EditBookModal,
} from "../components/StockManager/Modals/AddBookModal";
import AddPublisherModal from "../components/StockManager/Modals/AddPublisherModal";
import TrackingModal from "../components/StockManager/Modals/TrackingModal";
import RequestDetailsModal from "../components/StockManager/Modals/RequestDetailsModal";

// Import Utilities
import {
  calculateInventoryStats,
  calculateOrderStats,
  calculateRequestStats,
  filterBooks,
  sortBooks,
  showNotification,
  initialStockBooks,
  initialStockOrders,
  initialPublishers,
} from "../components/StockManager/utils";

const StockManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(window.localStorage.getItem("currentUser"));
    } catch (error) {
      console.error("Failed to parse currentUser from storage", error);
      return null;
    }
  });

  // Extract tab from query parameters
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get("tab");
  const activeTab = tabFromQuery || "dashboard";
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [showAddPublisherModal, setShowAddPublisherModal] = useState(false);
  const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stock_managerNotes, setstock_managerNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Form states
  const defaultCategories = ["Fiction", "Non-Fiction", "Science", "Fantasy"];

  const [categories, setCategories] = useState(() => {
    if (typeof window === "undefined") return defaultCategories;
    const stored = JSON.parse(window.localStorage.getItem("categories"));
    return Array.isArray(stored) && stored.length ? stored : defaultCategories;
  });

  const [authors, setAuthors] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = JSON.parse(window.localStorage.getItem("authors"));
      return Array.isArray(stored) ? stored : [];
    } catch (error) {
      console.error("Failed to parse authors from storage", error);
      return [];
    }
  });

  const [newBook, setNewBook] = useState({
    isbn: "",
    title: "",
    author: "",
    category: (Array.isArray(categories) && categories[0]) || "Fiction",
    price: "",
    costPrice: "",
    stock: "",
    minStock: 5,
    maxStock: 100,
    description: "",
    publisher: "",
    publicationYear: new Date().getFullYear(),
    pages: 300,
    language: "English",
    weight: "0.5",
    dimensions: "20x13x3 cm",
    images: [],
    image: "",
  });

  const [newPublisher, setNewPublisher] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editingPublisherId, setEditingPublisherId] = useState(null);

  const [trackingUpdate, setTrackingUpdate] = useState({
    status: "Shipped",
    note: "",
    location: "",
    courier: "",
    trackingNumber: "",
  });

  // Data states
  const [stockBooks, setStockBooks] = useState(() => {
    if (typeof window === "undefined") return initialStockBooks();
    const stored = JSON.parse(window.localStorage.getItem("stockBooks"));
    return stored || initialStockBooks();
  });

  const [stockOrders, setStockOrders] = useState(() => {
    if (typeof window === "undefined") return initialStockOrders();
    const stored = JSON.parse(window.localStorage.getItem("stockOrders"));
    return stored || initialStockOrders();
  });

  const [publishers, setPublishers] = useState(() => {
    if (typeof window === "undefined") return initialPublishers();
    const stored = JSON.parse(window.localStorage.getItem("publishers"));
    return stored || initialPublishers();
  });

  const [bookRequests, setBookRequests] = useState(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(window.localStorage.getItem("bookRequests")) || [];
  });

  const loadAllData = useCallback(() => {
    if (typeof window === "undefined") return;

    const storedRequests =
      JSON.parse(window.localStorage.getItem("bookRequests")) || [];
    setBookRequests(storedRequests);

    const storedBooks = JSON.parse(window.localStorage.getItem("stockBooks"));
    if (storedBooks) setStockBooks(storedBooks);

    const storedPublishers = JSON.parse(
      window.localStorage.getItem("publishers"),
    );
    if (storedPublishers) setPublishers(storedPublishers);

    const storedOrders = JSON.parse(window.localStorage.getItem("stockOrders"));
    if (storedOrders) setStockOrders(storedOrders);

    const storedAuthors = JSON.parse(window.localStorage.getItem("authors"));
    if (storedAuthors)
      setAuthors(Array.isArray(storedAuthors) ? storedAuthors : []);
  }, []);

  const handleStorageChange = useCallback(
    (e) => {
      if (typeof window === "undefined") return;

      if (
        e.key === "stockBooks" ||
        e.key === "publishers" ||
        e.key === "stockOrders" ||
        e.key === "bookRequests" ||
        e.key === "authors"
      ) {
        loadAllData();
      }

      if (e.key === "currentUser") {
        try {
          const updatedUser = JSON.parse(
            window.localStorage.getItem("currentUser"),
          );
          setCurrentUser(updatedUser);
        } catch (error) {
          console.error("Failed to parse currentUser from storage", error);
          setCurrentUser(null);
        }
      }
    },
    [loadAllData, setCurrentUser],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    if (!currentUser) {
      navigate("/login");
      return undefined;
    }

    if (
      currentUser.role !== "stock" &&
      currentUser.role !== "stock-manager" &&
      currentUser.role !== "admin"
    ) {
      alert("Access denied. Stock manager or admin privileges required.");
      navigate("/");
      return undefined;
    }

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [currentUser, navigate, handleStorageChange]);

  // Calculate statistics
  const inventoryStats = calculateInventoryStats(stockBooks);
  const orderStats = calculateOrderStats(stockOrders);
  const requestStats = calculateRequestStats(bookRequests);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleTabChange = (tab) => {
    navigate(`${location.pathname}?tab=${tab}`);
  };

  const resetPublisherForm = () => {
    setNewPublisher({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
    setEditingPublisherId(null);
  };

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleInputChange = (setter) => async (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "images" && files) {
      const fileList = Array.from(files);
      const dataUrls = await Promise.all(fileList.map(readFileAsDataURL));
      setter((prev) => ({
        ...prev,
        images: dataUrls,
        image: dataUrls[0] || "",
      }));
      return;
    }

    setter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNewAuthor = (author) => {
    setAuthors((prev) => {
      const next = [...prev, author];
      if (typeof window !== "undefined") {
        window.localStorage.setItem("authors", JSON.stringify(next));
      }
      return next;
    });
  };

  const handleEditAuthor = (author) => {
    const key = author.id || author;
    setAuthors((prev) => {
      const next = prev.map((a) => ((a.id || a) === key ? author : a));
      if (typeof window !== "undefined") {
        window.localStorage.setItem("authors", JSON.stringify(next));
      }
      return next;
    });
  };

  const handleDeleteAuthor = (author) => {
    const key = author.id || author;
    setAuthors((prev) => {
      const next = prev.filter((a) => (a.id || a) !== key);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("authors", JSON.stringify(next));
      }
      return next;
    });
  };

  const resetBookForm = () => {
    setNewBook({
      isbn: "",
      title: "",
      author: "",
      category: categories[0] || defaultCategories[0],
      price: "",
      costPrice: "",
      stock: "",
      minStock: 5,
      maxStock: 100,
      description: "",
      publisher: "",
      publicationYear: new Date().getFullYear(),
      pages: 300,
      language: "English",
      weight: "0.5",
      dimensions: "20x13x3 cm",
      images: [],
      image: "",
    });
    setEditingBookId(null);
  };

  const openAddBookModal = () => {
    resetBookForm();
    setShowAddBookModal(true);
  };

  const handleSaveCategory = (name, previousName = null) => {
    const trimmed = (name || "").trim();
    if (!trimmed) return;

    setCategories((prev) => {
      let next = [...prev];

      if (previousName && previousName !== trimmed) {
        // Rename
        if (!prev.includes(previousName)) return prev;
        if (prev.includes(trimmed)) {
          showNotification("Category already exists", "info");
          return prev;
        }
        next = prev.map((cat) => (cat === previousName ? trimmed : cat));
      } else if (!prev.includes(trimmed)) {
        // Add
        next = [...prev, trimmed];
      }

      localStorage.setItem("categories", JSON.stringify(next));
      setNewBook((book) => ({ ...book, category: trimmed }));
      return next;
    });
  };

  const handleDeleteCategory = (name) => {
    const trimmed = (name || "").trim();
    if (!trimmed) return;

    setCategories((prev) => {
      const next = prev.filter((cat) => cat !== trimmed);
      if (!next.length) {
        const fallback = defaultCategories[0];
        localStorage.setItem("categories", JSON.stringify([fallback]));
        setNewBook((book) => ({ ...book, category: fallback }));
        return [fallback];
      }

      localStorage.setItem("categories", JSON.stringify(next));
      setNewBook((book) => ({ ...book, category: next[0] }));
      return next;
    });
  };

  const handleAddBook = (e) => {
    e.preventDefault();

    // Validate form
    if (
      !newBook.isbn ||
      !newBook.title ||
      !newBook.author ||
      !newBook.price ||
      !newBook.stock
    ) {
      showNotification("Please fill in all required fields correctly", "error");
      return;
    }

    // Calculate status
    let status;
    if (parseInt(newBook.stock) === 0) {
      status = "Out of Stock";
    } else if (parseInt(newBook.stock) <= parseInt(newBook.minStock)) {
      status = "Low Stock";
    } else {
      status = "In Stock";
    }

    const newBookObj = {
      id: Date.now(),
      isbn: newBook.isbn,
      title: newBook.title,
      author: newBook.author,
      category: newBook.category,
      price: parseFloat(newBook.price),
      costPrice:
        parseFloat(newBook.costPrice) || parseFloat(newBook.price) * 0.6,
      stock: parseInt(newBook.stock),
      minStock: parseInt(newBook.minStock),
      maxStock: parseInt(newBook.maxStock),
      status: status,
      description: newBook.description,
      publisher: newBook.publisher,
      publicationYear: parseInt(newBook.publicationYear),
      pages: parseInt(newBook.pages),
      language: newBook.language,
      weight: newBook.weight,
      dimensions: newBook.dimensions,
      images: newBook.images || [],
      image:
        newBook.image ||
        (Array.isArray(newBook.images) ? newBook.images[0] : ""),
      lastRestocked: new Date().toISOString().split("T")[0],
      salesThisMonth: 0,
      totalSales: 0,
      featured: false,
      createdAt: new Date().toISOString(),
    };

    const updatedBooks = [...stockBooks, newBookObj];
    setStockBooks(updatedBooks);
    localStorage.setItem("stockBooks", JSON.stringify(updatedBooks));

    // Reset form
    resetBookForm();

    setShowAddBookModal(false);
    showNotification("Book added successfully!", "success");
    window.dispatchEvent(new Event("storage"));
  };

  const handleUpdateBook = (e) => {
    e.preventDefault();

    if (!editingBookId) {
      return;
    }

    if (
      !newBook.isbn ||
      !newBook.title ||
      !newBook.author ||
      !newBook.price ||
      !newBook.stock
    ) {
      showNotification("Please fill in all required fields correctly", "error");
      return;
    }

    let status;
    if (parseInt(newBook.stock) === 0) {
      status = "Out of Stock";
    } else if (parseInt(newBook.stock) <= parseInt(newBook.minStock)) {
      status = "Low Stock";
    } else {
      status = "In Stock";
    }

    const existingBook = stockBooks.find((b) => b.id === editingBookId);
    if (!existingBook) {
      return;
    }

    const updatedBook = {
      ...existingBook,
      isbn: newBook.isbn,
      title: newBook.title,
      author: newBook.author,
      category: newBook.category,
      price: parseFloat(newBook.price),
      costPrice:
        parseFloat(newBook.costPrice) || parseFloat(newBook.price) * 0.6,
      stock: parseInt(newBook.stock),
      minStock: parseInt(newBook.minStock),
      maxStock: parseInt(newBook.maxStock),
      status,
      description: newBook.description,
      publisher: newBook.publisher,
      publicationYear: parseInt(newBook.publicationYear),
      pages: parseInt(newBook.pages),
      language: newBook.language,
      weight: newBook.weight,
      dimensions: newBook.dimensions,
      images: newBook.images || existingBook.images || [],
      image:
        newBook.image ||
        (Array.isArray(newBook.images) && newBook.images[0]) ||
        existingBook.image ||
        (Array.isArray(existingBook.images) ? existingBook.images[0] : ""),
    };

    const updatedBooks = stockBooks.map((book) =>
      book.id === editingBookId ? updatedBook : book,
    );

    setStockBooks(updatedBooks);
    localStorage.setItem("stockBooks", JSON.stringify(updatedBooks));

    resetBookForm();
    setShowAddBookModal(false);
    showNotification("Book updated successfully!", "success");
    window.dispatchEvent(new Event("storage"));
  };

  const handleAddPublisher = (e) => {
    e.preventDefault();

    if (!newPublisher.name || !newPublisher.email) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    if (editingPublisherId) {
      const updatedPublishers = publishers.map((publisher) =>
        publisher.id === editingPublisherId
          ? {
              ...publisher,
              name: newPublisher.name,
              email: newPublisher.email,
              phone: newPublisher.phone,
              address: newPublisher.address,
            }
          : publisher,
      );

      setPublishers(updatedPublishers);
      localStorage.setItem("publishers", JSON.stringify(updatedPublishers));
      showNotification("Publisher updated successfully!", "success");
    } else {
      const newPublisherObj = {
        id: `PUB${String(publishers.length + 1).padStart(3, "0")}`,
        name: newPublisher.name,
        email: newPublisher.email,
        phone: newPublisher.phone,
        address: newPublisher.address,
        booksSupplied: 0,
        status: "Active",
        rating: 5,
        paymentTerms: "30 days",
        leadTime: "7",
        lastOrder: null,
        createdAt: new Date().toISOString(),
      };

      const updatedPublishers = [...publishers, newPublisherObj];
      setPublishers(updatedPublishers);
      localStorage.setItem("publishers", JSON.stringify(updatedPublishers));
      showNotification("Publisher added successfully!", "success");
    }

    resetPublisherForm();

    setShowAddPublisherModal(false);
    handleTabChange("publishers");
    window.dispatchEvent(new Event("storage"));
  };

  const handleEditPublisher = (publisher) => {
    setNewPublisher({
      name: publisher.name || "",
      email: publisher.email || "",
      phone: publisher.phone || "",
      address: publisher.address || "",
    });
    setEditingPublisherId(publisher.id);
    setShowAddPublisherModal(true);
  };

  const handleCloseAddPublisher = () => {
    resetPublisherForm();
    setShowAddPublisherModal(false);
  };

  const handleDeleteBook = (bookId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this book from inventory?",
      )
    ) {
      const updatedBooks = stockBooks.filter((book) => book.id !== bookId);
      setStockBooks(updatedBooks);
      localStorage.setItem("stockBooks", JSON.stringify(updatedBooks));
      showNotification("Book deleted successfully", "success");
      window.dispatchEvent(new Event("storage"));
    }
  };

  const handleEditBook = (bookId) => {
    const book = stockBooks.find((b) => b.id === bookId);
    if (book) {
      setNewBook({
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        category: book.category,
        price: book.price.toString(),
        costPrice: book.costPrice.toString(),
        stock: book.stock.toString(),
        minStock: book.minStock,
        maxStock: book.maxStock,
        description: book.description || "",
        publisher: book.publisher || "",
        publicationYear: book.publicationYear || new Date().getFullYear(),
        pages: book.pages || 300,
        language: book.language || "English",
        weight: book.weight || "0.5",
        dimensions: book.dimensions || "20x13x3 cm",
        images: book.images || (book.image ? [book.image] : []),
        image: book.image || (Array.isArray(book.images) ? book.images[0] : ""),
      });
      setEditingBookId(bookId);
      setShowAddBookModal(true);
    }
  };

  const handleRestockBook = (bookId, quantity) => {
    const updatedBooks = stockBooks.map((book) => {
      if (book.id === bookId) {
        const newStock = book.stock + quantity;
        let status = book.status;
        if (newStock === 0) {
          status = "Out of Stock";
        } else if (newStock <= book.minStock) {
          status = "Low Stock";
        } else {
          status = "In Stock";
        }

        return {
          ...book,
          stock: newStock,
          status: status,
          lastRestocked: new Date().toISOString().split("T")[0],
        };
      }
      return book;
    });

    setStockBooks(updatedBooks);
    localStorage.setItem("stockBooks", JSON.stringify(updatedBooks));
    showNotification(`Restocked ${quantity} items`, "success");
    window.dispatchEvent(new Event("storage"));
  };

  const handleViewOrder = (orderId) => {
    const order = stockOrders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      showNotification(`Viewing order: ${orderId}`, "info");
    }
  };

  const handleShipOrder = (orderId) => {
    if (window.confirm(`Mark order ${orderId} as shipped?`)) {
      const updatedOrders = stockOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "Shipped",
              shippedDate: new Date().toISOString().split("T")[0],
            }
          : order,
      );
      setStockOrders(updatedOrders);
      localStorage.setItem("stockOrders", JSON.stringify(updatedOrders));
      showNotification(`Order ${orderId} marked as shipped`, "success");
    }
  };

  const handleUpdateTracking = (orderId) => {
    const order = stockOrders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setTrackingUpdate({
        status: order.status === "Processing" ? "Shipped" : order.status,
        note: "",
        location: "",
        courier: order.courier || "",
        trackingNumber: order.trackingNumber || "",
      });
      setShowTrackingModal(true);
    }
  };

  const handleSaveTracking = () => {
    if (!trackingUpdate.status) {
      showNotification("Please select a status", "error");
      return;
    }

    const trackingUpdates =
      JSON.parse(localStorage.getItem("orderTrackingUpdates")) || [];

    const newTrackingUpdate = {
      orderId: selectedOrder.id,
      status: trackingUpdate.status,
      note: trackingUpdate.note,
      location: trackingUpdate.location,
      courier: trackingUpdate.courier,
      trackingNumber: trackingUpdate.trackingNumber,
      timestamp: new Date().toISOString(),
      updatedBy: currentUser.name,
    };

    trackingUpdates.push(newTrackingUpdate);
    localStorage.setItem(
      "orderTrackingUpdates",
      JSON.stringify(trackingUpdates),
    );

    // Update order status
    const updatedOrders = stockOrders.map((order) =>
      order.id === selectedOrder.id
        ? {
            ...order,
            status: trackingUpdate.status,
            courier: trackingUpdate.courier,
            trackingNumber: trackingUpdate.trackingNumber,
          }
        : order,
    );

    setStockOrders(updatedOrders);
    localStorage.setItem("stockOrders", JSON.stringify(updatedOrders));

    setShowTrackingModal(false);
    showNotification("Tracking updated successfully!", "success");
  };

  const handleContactPublisher = (publisherId) => {
    const publisher = publishers.find((p) => p.id === publisherId);
    if (publisher) {
      window.location.href = `mailto:${publisher.email}`;
    }
  };

  const handleDeletePublisher = (publisherId) => {
    if (window.confirm("Are you sure you want to delete this publisher?")) {
      const updatedPublishers = publishers.filter((p) => p.id !== publisherId);
      setPublishers(updatedPublishers);
      localStorage.setItem("publishers", JSON.stringify(updatedPublishers));
      showNotification("Publisher deleted successfully", "success");
    }
  };

  const handleViewRequestDetails = (requestId) => {
    const request = bookRequests.find((r) => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setstock_managerNotes(request.stock_managerNotes || "");
      setShowRequestDetailsModal(true);
    }
  };

  const handleApproveRequest = (requestId, notes = "") => {
    const updatedRequests = bookRequests.map((request) => {
      if (request.id === requestId) {
        return {
          ...request,
          status: "Approved",
          stock_managerNotes: notes || request.stock_managerNotes,
          dateUpdated: new Date().toISOString(),
          updatedBy: currentUser.name,
        };
      }
      return request;
    });

    setBookRequests(updatedRequests);
    localStorage.setItem("bookRequests", JSON.stringify(updatedRequests));
    setShowRequestDetailsModal(false);
    showNotification("Request approved successfully!", "success");
  };

  const handleRejectRequest = (requestId, notes = "") => {
    const updatedRequests = bookRequests.map((request) => {
      if (request.id === requestId) {
        return {
          ...request,
          status: "Rejected",
          stock_managerNotes: notes || request.stock_managerNotes,
          dateUpdated: new Date().toISOString(),
          updatedBy: currentUser.name,
        };
      }
      return request;
    });

    setBookRequests(updatedRequests);
    localStorage.setItem("bookRequests", JSON.stringify(updatedRequests));
    setShowRequestDetailsModal(false);
    showNotification("Request rejected", "warning");
  };

  const toggleFeaturedBook = (bookId) => {
    const updatedBooks = stockBooks.map((book) =>
      book.id === bookId ? { ...book, featured: !book.featured } : book,
    );

    setStockBooks(updatedBooks);
    localStorage.setItem("stockBooks", JSON.stringify(updatedBooks));

    const book = updatedBooks.find((b) => b.id === bookId);
    showNotification(
      book.featured
        ? "Book marked as featured for home page"
        : "Book removed from featured",
      "success",
    );

    window.dispatchEvent(new Event("storage"));
  };

  const handlePrintReport = () => {
    const printContent = document.querySelector(".report-content-container");
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (printContent && printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Stock Manager Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              .report-section { margin-bottom: 30px; }
              .table { width: 100%; border-collapse: collapse; }
              .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .table th { background-color: #f5f5f5; }
              .total-row { font-weight: bold; background-color: #f9f9f9; }
            </style>
          </head>
          <body>
            <h1>Stock Manager Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      showNotification("No report content found to print", "warning");
    }
  };

  const handleExportReport = () => {
    let csvContent = "Stock Manager Report\n";
    csvContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

    // Stock Summary
    csvContent += "Stock Summary\n";
    csvContent += `Total Books in Inventory,${inventoryStats.totalBooks}\n`;
    csvContent += `Low Stock Items,${inventoryStats.lowStockItems}\n`;
    csvContent += `Out of Stock Items,${inventoryStats.outOfStockBooks}\n\n`;

    // Sales Summary
    csvContent += "Sales Summary\n";
    csvContent += `Total Orders,${orderStats.total}\n`;
    csvContent += `Orders Processing,${orderStats.processing}\n`;
    csvContent += `Orders Shipped,${orderStats.shipped}\n`;
    csvContent += `Orders Delivered,${orderStats.delivered}\n\n`;

    // Books Inventory
    csvContent += "Books Inventory\n";
    csvContent += "Title,Author,Category,Price,Stock,Status\n";
    stockBooks.forEach((book) => {
      csvContent += `"${book.title}","${book.author}","${book.category}",${book.price},${book.stock},"${book.status}"\n`;
    });

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock-manager-report-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification("Report exported successfully as CSV", "success");
  };

  const renderActiveTab = () => {
    const stats = {
      inventory: inventoryStats,
      orders: orderStats,
      requests: requestStats,
    };

    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab
            stats={stats}
            onAddBook={openAddBookModal}
            onAddPublisher={() => {
              resetPublisherForm();
              setShowAddPublisherModal(true);
            }}
            onViewRequests={() => handleTabChange("book-requests")}
            onViewReports={() => handleTabChange("reports")}
            onManagePopularBooks={() => handleTabChange("popular-books")}
            onViewOrders={() => handleTabChange("orders")}
            orders={stockOrders}
            lowStockBooks={stockBooks.filter(
              (book) =>
                book.status === "Low Stock" || book.status === "Out of Stock",
            )}
            onViewOrder={handleViewOrder}
            onUpdateTracking={handleUpdateTracking}
            onRestockBook={handleRestockBook}
          />
        );
      case "inventory":
        return (
          <InventoryTab
            stats={inventoryStats}
            books={sortBooks(filterBooks(stockBooks, searchQuery), sortConfig)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSort={handleSort}
            sortConfig={sortConfig}
            onAddBook={openAddBookModal}
            onEditBook={handleEditBook}
            onDeleteBook={handleDeleteBook}
            onRestockBook={handleRestockBook}
            onToggleFeatured={toggleFeaturedBook}
          />
        );
      case "orders":
        return (
          <OrdersTab
            stats={orderStats}
            orders={stockOrders}
            onViewOrder={handleViewOrder}
            onShipOrder={handleShipOrder}
            onUpdateTracking={handleUpdateTracking}
          />
        );
      case "reports":
        return (
          <ReportsTab
            inventoryStats={inventoryStats}
            orderStats={orderStats}
            stockBooks={stockBooks}
            onPrint={handlePrintReport}
            onExport={handleExportReport}
          />
        );
      case "publishers":
        return (
          <PublishersTab
            publishers={publishers}
            onAddPublisher={() => {
              resetPublisherForm();
              setShowAddPublisherModal(true);
            }}
            onEditPublisher={handleEditPublisher}
            onContactPublisher={handleContactPublisher}
            onDeletePublisher={handleDeletePublisher}
          />
        );
      case "book-requests":
        return (
          <BookRequestsTab
            stats={requestStats}
            requests={bookRequests}
            onViewRequestDetails={handleViewRequestDetails}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onChangeTab={handleTabChange}
          />
        );
      case "popular-books":
        return (
          <PopularBooksTab
            popularBooks={[...stockBooks]
              .sort((a, b) => b.salesThisMonth - a.salesThisMonth)
              .slice(0, 12)}
            featuredBooks={stockBooks.filter((book) => book.featured)}
            inventoryStats={inventoryStats}
            onEditBook={handleEditBook}
            onRestockBook={handleRestockBook}
            onToggleFeatured={toggleFeaturedBook}
            onChangeTab={handleTabChange}
          />
        );
      default:
        return (
          <DashboardTab
            stats={stats}
            onAddBook={openAddBookModal}
            onAddPublisher={() => {
              resetPublisherForm();
              setShowAddPublisherModal(true);
            }}
            onViewRequests={() => handleTabChange("book-requests")}
            onViewReports={() => handleTabChange("reports")}
            onManagePopularBooks={() => handleTabChange("popular-books")}
            onViewOrders={() => handleTabChange("orders")}
            orders={stockOrders}
            lowStockBooks={stockBooks.filter(
              (book) =>
                book.status === "Low Stock" || book.status === "Out of Stock",
            )}
            onViewOrder={handleViewOrder}
            onUpdateTracking={handleUpdateTracking}
            onRestockBook={handleRestockBook}
          />
        );
    }
  };

  if (!currentUser) {
    return (
      <div className="stock-manager">
        <StockManagerHeader />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading stock manager...</span>
          </div>
          <p className="mt-3">Loading stock manager...</p>
        </div>
        <StockManagerFooter />
      </div>
    );
  }

  return (
    <div className="stock-manager">
      <StockManagerHeader />

      <div className="container-fluid mt-4">
        <div className="row">
          <Sidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            inventoryStats={inventoryStats}
            orderStats={orderStats}
            requestStats={requestStats}
          />

          <div className="col-lg-10">
            <div className="tab-content">{renderActiveTab()}</div>
          </div>
        </div>
      </div>

      <StockManagerFooter />
      {editingBookId ? (
        <EditBookModal
          show={showAddBookModal}
          onClose={() => {
            setShowAddBookModal(false);
            resetBookForm();
          }}
          newBook={newBook}
          onInputChange={handleInputChange(setNewBook)}
          onSubmit={handleUpdateBook}
          categories={categories}
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
          authors={authors}
          onNewAuthor={handleNewAuthor}
          onEditAuthor={handleEditAuthor}
          onDeleteAuthor={handleDeleteAuthor}
          publishers={publishers}
        />
      ) : (
        <AddBookModal
          show={showAddBookModal}
          onClose={() => {
            setShowAddBookModal(false);
            resetBookForm();
          }}
          newBook={newBook}
          onInputChange={handleInputChange(setNewBook)}
          onSubmit={handleAddBook}
          categories={categories}
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
          authors={authors}
          onNewAuthor={handleNewAuthor}
          onEditAuthor={handleEditAuthor}
          onDeleteAuthor={handleDeleteAuthor}
          publishers={publishers}
        />
      )}

      <AddPublisherModal
        show={showAddPublisherModal}
        onClose={handleCloseAddPublisher}
        newPublisher={newPublisher}
        onInputChange={handleInputChange(setNewPublisher)}
        onSubmit={handleAddPublisher}
        isEditing={!!editingPublisherId}
      />

      <TrackingModal
        show={showTrackingModal}
        onClose={() => setShowTrackingModal(false)}
        selectedOrder={selectedOrder}
        trackingUpdate={trackingUpdate}
        onTrackingUpdate={setTrackingUpdate}
        onSave={handleSaveTracking}
        currentUser={currentUser}
      />

      <RequestDetailsModal
        show={showRequestDetailsModal}
        onClose={() => setShowRequestDetailsModal(false)}
        selectedRequest={selectedRequest}
        stock_managerNotes={stock_managerNotes}
        onNotesChange={setstock_managerNotes}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
        currentUser={currentUser}
      />
    </div>
  );
};

export default StockManager;
