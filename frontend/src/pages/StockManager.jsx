// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../styles/pages/StockManager.css";

// // Import Components
// import Header from "../components/StockManagerHeader";
// import Footer from "../components/StockManagerFooter";
// import Sidebar from "../components/StockManager/Sidebar";
// import DashboardTab from "../components/StockManager/DashboardTab";
// import InventoryTab from "../components/StockManager/InventoryTab";
// import OrdersTab from "../components/StockManager/OrdersTab";
// import ReportsTab from "../components/StockManager/ReportsTab";
// import SuppliersTab from "../components/StockManager/SuppliersTab";
// import BookRequestsTab from "../components/StockManager/BookRequestsTab";
// import PopularBooksTab from "../components/StockManager/PopularBooksTab";

// // Import Modals
// import AddBookModal from "../components/StockManager/Modals/AddBookModal";
// import AddSupplierModal from "../components/StockManager/Modals/AddSupplierModal";
// import TrackingModal from "../components/StockManager/Modals/TrackingModal";
// import RequestDetailsModal from "../components/StockManager/Modals/RequestDetailsModal";

// // Import Utilities
// import { TAB_NAMES } from "../components/StockManager/utils/constants";
// import { 
//   usdToLkr, 
//   calculateInventoryStats, 
//   calculateOrderStats, 
//   calculateRequestStats,
//   filterBooks,
//   sortBooks,
//   loadAllData,
//   saveDataToStorage,
//   showNotification,
//   getInitialBooks,
//   getInitialOrders,
//   getInitialSuppliers,
//   hasStockManagerPrivileges,
//   formatNewBook
// } from "../components/StockManager/utils/helpers";
// import { formatCurrency } from "../components/StockManager/utils/formatters";

// const StockManager = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // State for data
//   const [stockBooks, setStockBooks] = useState([]);
//   const [stockOrders, setStockOrders] = useState([]);
//   const [suppliers, setSuppliers] = useState([]);
//   const [bookRequests, setBookRequests] = useState([]);

//   // State for UI
//   const queryParams = new URLSearchParams(location.search);
//   const tabFromQuery = queryParams.get("tab");
//   const [activeTab, setActiveTab] = useState(tabFromQuery || TAB_NAMES.DASHBOARD);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

//   // State for modals
//   const [showAddBookModal, setShowAddBookModal] = useState(false);
//   const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
//   const [showTrackingModal, setShowTrackingModal] = useState(false);
//   const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);

//   // State for forms
//   const [newBook, setNewBook] = useState({
//     id: null,
//     isbn: "",
//     title: "",
//     author: "",
//     category: "Fiction",
//     price: "",
//     costPrice: "",
//     stock: "",
//     minStock: 5,
//     maxStock: 100,
//     description: "",
//     publisher: "",
//     publicationYear: new Date().getFullYear(),
//     pages: 300,
//     language: "English",
//     weight: "0.5",
//     dimensions: "20x13x3 cm",
//   });

//   const [newSupplier, setNewSupplier] = useState({
//     name: "",
//     contact: "",
//     email: "",
//     phone: "",
//     address: "",
//     website: "",
//     paymentTerms: "30 days",
//     leadTime: "7",
//     rating: 5,
//   });

//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [trackingUpdate, setTrackingUpdate] = useState({
//     status: "Shipped",
//     note: "",
//     location: "",
//     courier: "",
//     trackingNumber: "",
//   });

//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [stock_managerNotes, setstock_managerNotes] = useState("");

//   // Update activeTab when query parameter changes
//   useEffect(() => {
//     if (tabFromQuery) {
//       setActiveTab(tabFromQuery);
//     }
//   }, [tabFromQuery]);

//   useEffect(() => {
//     // Check if user is logged in and has stock manager privileges
//     const user = JSON.parse(localStorage.getItem("currentUser"));

//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     if (!hasStockManagerPrivileges(user)) {
//       alert("Access denied. Stock manager or admin privileges required.");
//       navigate("/");
//       return;
//     }

//     setCurrentUser(user);

//     // Load data from localStorage or use initial data
//     const loadData = () => {
//       try {
//         const data = loadAllData();
        
//         if (data.stockBooks.length === 0) {
//           const initialBooks = getInitialBooks();
//           setStockBooks(initialBooks);
//           saveDataToStorage("stockBooks", initialBooks);
//         } else {
//           setStockBooks(data.stockBooks);
//         }

//         if (data.stockOrders.length === 0) {
//           const initialOrders = getInitialOrders();
//           setStockOrders(initialOrders);
//           saveDataToStorage("stockOrders", initialOrders);
//         } else {
//           setStockOrders(data.stockOrders);
//         }

//         if (data.suppliers.length === 0) {
//           const initialSuppliers = getInitialSuppliers();
//           setSuppliers(initialSuppliers);
//           saveDataToStorage("suppliers", initialSuppliers);
//         } else {
//           setSuppliers(data.suppliers);
//         }

//         setBookRequests(data.bookRequests);
//       } catch (error) {
//         console.error("Error loading data:", error);
//         // Fallback to initial data
//         const initialBooks = getInitialBooks();
//         const initialOrders = getInitialOrders();
//         const initialSuppliers = getInitialSuppliers();
        
//         setStockBooks(initialBooks);
//         setStockOrders(initialOrders);
//         setSuppliers(initialSuppliers);
//         setBookRequests([]);
//       }
//     };

//     loadData();

//     // Simulate loading
//     setTimeout(() => setLoading(false), 1000);

//     // Listen for storage changes
//     const handleStorageChange = (e) => {
//       if (
//         e.key === "stockBooks" ||
//         e.key === "suppliers" ||
//         e.key === "stockOrders" ||
//         e.key === "bookRequests"
//       ) {
//         loadData();
//       }
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//     };
//   }, [navigate]);

//   // Calculate statistics
//   const inventoryStats = calculateInventoryStats(stockBooks);
//   const orderStats = calculateOrderStats(stockOrders);
//   const requestStats = calculateRequestStats(bookRequests);

//   // Filter and sort books
//   const filteredBooks = filterBooks(stockBooks, searchQuery);
//   const sortedBooks = sortBooks(filteredBooks, sortConfig);

//   // Sidebar stats
//   const sidebarStats = {
//     lowStockItems: inventoryStats.lowStockItems,
//     processingOrders: orderStats.processing,
//     featuredBooks: inventoryStats.featuredBooks,
//     pendingRequests: requestStats.pending
//   };

//   // Tab change handler
//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     navigate(`${location.pathname}?tab=${tab}`);
//   };

//   // Sort handler
//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   // Book handlers
//   const handleAddBook = (e) => {
//     e.preventDefault();

//     // Validate form
//     if (!newBook.isbn || !newBook.title || !newBook.author || !newBook.price || !newBook.stock) {
//       showNotification("Please fill in all required fields correctly", "error");
//       return;
//     }

//     const isEditing = !!newBook.id;
//     const bookData = formatNewBook(newBook, isEditing);

//     let updatedBooks;
//     if (isEditing) {
//       // Update existing book
//       updatedBooks = stockBooks.map(book => 
//         book.id === newBook.id ? { ...bookData, createdAt: book.createdAt } : book
//       );
//     } else {
//       // Add new book
//       updatedBooks = [...stockBooks, bookData];
//     }

//     setStockBooks(updatedBooks);
//     saveDataToStorage("stockBooks", updatedBooks);

//     // Reset form
//     setNewBook({
//       id: null,
//       isbn: "",
//       title: "",
//       author: "",
//       category: "Fiction",
//       price: "",
//       costPrice: "",
//       stock: "",
//       minStock: 5,
//       maxStock: 100,
//       description: "",
//       publisher: "",
//       publicationYear: new Date().getFullYear(),
//       pages: 300,
//       language: "English",
//       weight: "0.5",
//       dimensions: "20x13x3 cm",
//     });

//     setShowAddBookModal(false);
//     showNotification(isEditing ? "Book updated successfully!" : "Book added successfully!", "success");

//     // Update other pages
//     window.dispatchEvent(new Event("storage"));
//   };

//   const handleEditBook = (bookId) => {
//     const book = stockBooks.find((b) => b.id === bookId);
//     if (book) {
//       setNewBook({
//         id: book.id,
//         isbn: book.isbn,
//         title: book.title,
//         author: book.author,
//         category: book.category,
//         price: book.price.toString(),
//         costPrice: book.costPrice.toString(),
//         stock: book.stock.toString(),
//         minStock: book.minStock,
//         maxStock: book.maxStock,
//         description: book.description || "",
//         publisher: book.publisher || "",
//         publicationYear: book.publicationYear || new Date().getFullYear(),
//         pages: book.pages || 300,
//         language: book.language || "English",
//         weight: book.weight || "0.5",
//         dimensions: book.dimensions || "20x13x3 cm",
//         salesThisMonth: book.salesThisMonth,
//         totalSales: book.totalSales,
//         featured: book.featured,
//         createdAt: book.createdAt,
//       });
//       setShowAddBookModal(true);
//     }
//   };

//   const handleDeleteBook = (bookId) => {
//     if (window.confirm("Are you sure you want to delete this book from inventory?")) {
//       const updatedBooks = stockBooks.filter((book) => book.id !== bookId);
//       setStockBooks(updatedBooks);
//       saveDataToStorage("stockBooks", updatedBooks);
//       showNotification("Book deleted successfully", "success");
//       window.dispatchEvent(new Event("storage"));
//     }
//   };

//   const handleRestockBook = (bookId, quantity) => {
//     const updatedBooks = stockBooks.map((book) => {
//       if (book.id === bookId) {
//         const newStock = book.stock + quantity;
//         let status = book.status;
//         if (newStock === 0) {
//           status = "Out of Stock";
//         } else if (newStock <= book.minStock) {
//           status = "Low Stock";
//         } else {
//           status = "In Stock";
//         }

//         return {
//           ...book,
//           stock: newStock,
//           status: status,
//           lastRestocked: new Date().toISOString().split("T")[0],
//         };
//       }
//       return book;
//     });

//     setStockBooks(updatedBooks);
//     saveDataToStorage("stockBooks", updatedBooks);
//     showNotification(`Restocked ${quantity} items`, "success");
//     window.dispatchEvent(new Event("storage"));
//   };

//   const handleToggleFeatured = (bookId) => {
//     const updatedBooks = stockBooks.map((book) =>
//       book.id === bookId ? { ...book, featured: !book.featured } : book
//     );
    
//     setStockBooks(updatedBooks);
//     saveDataToStorage("stockBooks", updatedBooks);
    
//     const book = updatedBooks.find(b => b.id === bookId);
//     showNotification(
//       book.featured 
//         ? "Book marked as featured for home page" 
//         : "Book removed from featured",
//       "success"
//     );
    
//     // Update home page
//     window.dispatchEvent(new Event("storage"));
//   };

//   // Order handlers
//   const handleViewOrder = (orderId) => {
//     const order = stockOrders.find((o) => o.id === orderId);
//     if (order) {
//       setSelectedOrder(order);
//       showNotification(`Viewing order: ${orderId}`, "info");
//     }
//   };

//   const handleShipOrder = (orderId) => {
//     if (window.confirm(`Mark order ${orderId} as shipped?`)) {
//       const updatedOrders = stockOrders.map((order) =>
//         order.id === orderId
//           ? {
//               ...order,
//               status: "Shipped",
//               shippedDate: new Date().toISOString().split("T")[0],
//             }
//           : order
//       );
//       setStockOrders(updatedOrders);
//       saveDataToStorage("stockOrders", updatedOrders);
//       showNotification(`Order ${orderId} marked as shipped`, "success");
//     }
//   };

//   const handleUpdateTracking = (orderId) => {
//     const order = stockOrders.find((o) => o.id === orderId);
//     if (order) {
//       setSelectedOrder(order);
//       setTrackingUpdate({
//         status: order.status === "Processing" ? "Shipped" : order.status,
//         note: "",
//         location: "",
//         courier: order.courier || "",
//         trackingNumber: order.trackingNumber || "",
//       });
//       setShowTrackingModal(true);
//     }
//   };

//   const handleSaveTracking = () => {
//     if (!trackingUpdate.status) {
//       showNotification("Please select a status", "error");
//       return;
//     }

//     const trackingUpdates = JSON.parse(localStorage.getItem("orderTrackingUpdates")) || [];

//     const newTrackingUpdate = {
//       orderId: selectedOrder.id,
//       status: trackingUpdate.status,
//       note: trackingUpdate.note,
//       location: trackingUpdate.location,
//       courier: trackingUpdate.courier,
//       trackingNumber: trackingUpdate.trackingNumber,
//       timestamp: new Date().toISOString(),
//       updatedBy: currentUser.name,
//     };

//     trackingUpdates.push(newTrackingUpdate);
//     saveDataToStorage("orderTrackingUpdates", trackingUpdates);

//     // Update order status
//     const updatedOrders = stockOrders.map((order) =>
//       order.id === selectedOrder.id
//         ? {
//             ...order,
//             status: trackingUpdate.status,
//             courier: trackingUpdate.courier,
//             trackingNumber: trackingUpdate.trackingNumber,
//           }
//         : order
//     );

//     setStockOrders(updatedOrders);
//     saveDataToStorage("stockOrders", updatedOrders);

//     setShowTrackingModal(false);
//     showNotification("Tracking updated successfully!", "success");
//   };

//   // Supplier handlers
//   const handleAddSupplier = (e) => {
//     e.preventDefault();

//     if (!newSupplier.name || !newSupplier.contact || !newSupplier.email) {
//       showNotification("Please fill in all required fields", "error");
//       return;
//     }

//     const newSupplierObj = {
//       id: `SUP${String(suppliers.length + 1).padStart(3, "0")}`,
//       name: newSupplier.name,
//       contact: newSupplier.contact,
//       email: newSupplier.email,
//       phone: newSupplier.phone,
//       address: newSupplier.address,
//       website: newSupplier.website,
//       booksSupplied: 0,
//       status: "Active",
//       rating: parseFloat(newSupplier.rating),
//       paymentTerms: newSupplier.paymentTerms,
//       leadTime: newSupplier.leadTime,
//       lastOrder: null,
//       createdAt: new Date().toISOString(),
//     };

//     const updatedSuppliers = [...suppliers, newSupplierObj];
//     setSuppliers(updatedSuppliers);
//     saveDataToStorage("suppliers", JSON.stringify(updatedSuppliers));

//     // Reset form
//     setNewSupplier({
//       name: "",
//       contact: "",
//       email: "",
//       phone: "",
//       address: "",
//       website: "",
//       paymentTerms: "30 days",
//       leadTime: "7",
//       rating: 5,
//     });

//     setShowAddSupplierModal(false);
//     showNotification("Supplier added successfully!", "success");
//   };

//   const handleContactSupplier = (supplierId) => {
//     const supplier = suppliers.find((s) => s.id === supplierId);
//     if (supplier) {
//       window.location.href = `mailto:${supplier.email}`;
//     }
//   };

//   const handleDeleteSupplier = (supplierId) => {
//     if (window.confirm("Are you sure you want to delete this supplier?")) {
//       const updatedSuppliers = suppliers.filter((s) => s.id !== supplierId);
//       setSuppliers(updatedSuppliers);
//       saveDataToStorage("suppliers", JSON.stringify(updatedSuppliers));
//       showNotification("Supplier deleted successfully", "success");
//     }
//   };

//   // Request handlers
//   const handleViewRequestDetails = (requestId) => {
//     const request = bookRequests.find((r) => r.id === requestId);
//     if (request) {
//       setSelectedRequest(request);
//       setstock_managerNotes(request.stock_managerNotes || "");
//       setShowRequestDetailsModal(true);
//     }
//   };

//   const handleApproveRequest = (requestId, notes = "") => {
//     const updatedRequests = bookRequests.map((request) => {
//       if (request.id === requestId) {
//         return {
//           ...request,
//           status: "Approved",
//           stock_managerNotes: notes || request.stock_managerNotes,
//           dateUpdated: new Date().toISOString(),
//           updatedBy: currentUser.name,
//         };
//       }
//       return request;
//     });

//     setBookRequests(updatedRequests);
//     saveDataToStorage("bookRequests", JSON.stringify(updatedRequests));
//     setShowRequestDetailsModal(false);
//     showNotification("Request approved successfully!", "success");

//     // Automatically add to stock if needed
//     const approvedRequest = updatedRequests.find((r) => r.id === requestId);
//     if (approvedRequest && approvedRequest.status === "Approved") {
//       // Check if book already exists
//       const existingBook = stockBooks.find(
//         (book) =>
//           book.isbn === approvedRequest.isbn ||
//           book.title.toLowerCase() === approvedRequest.bookTitle.toLowerCase()
//       );

//       if (!existingBook) {
//         // Add to stock with minimal quantity
//         const newBookObj = {
//           id: Date.now(),
//           isbn: approvedRequest.isbn || `TEMP-${Date.now()}`,
//           title: approvedRequest.bookTitle,
//           author: approvedRequest.author,
//           category: approvedRequest.category || "General",
//           price: usdToLkr(19.99), // Default price
//           costPrice: usdToLkr(12.0),
//           stock: 5, // Initial stock
//           minStock: 3,
//           maxStock: 20,
//           status: "In Stock",
//           description: `Added from user request by ${approvedRequest.userName}`,
//           publisher: "Unknown",
//           publicationYear: new Date().getFullYear(),
//           pages: 300,
//           lastRestocked: new Date().toISOString().split("T")[0],
//           salesThisMonth: 0,
//           totalSales: 0,
//           featured: false,
//           createdAt: new Date().toISOString(),
//         };

//         const updatedBooks = [...stockBooks, newBookObj];
//         setStockBooks(updatedBooks);
//         saveDataToStorage("stockBooks", JSON.stringify(updatedBooks));
//         showNotification("Book added to inventory automatically", "info");
//       }
//     }
//   };

//   const handleRejectRequest = (requestId, notes = "") => {
//     const updatedRequests = bookRequests.map((request) => {
//       if (request.id === requestId) {
//         return {
//           ...request,
//           status: "Rejected",
//           stock_managerNotes: notes || request.stock_managerNotes,
//           dateUpdated: new Date().toISOString(),
//           updatedBy: currentUser.name,
//         };
//       }
//       return request;
//     });

//     setBookRequests(updatedRequests);
//     saveDataToStorage("bookRequests", JSON.stringify(updatedRequests));
//     setShowRequestDetailsModal(false);
//     showNotification("Request rejected", "warning");
//   };

//   // Render active tab
//   const renderActiveTab = () => {
//     switch (activeTab) {
//       case TAB_NAMES.DASHBOARD:
//         return (
//           <DashboardTab
//             stats={{
//               totalBooks: inventoryStats.totalBooks,
//               lowStockItems: inventoryStats.lowStockItems,
//               processingOrders: orderStats.processing,
//               totalRevenue: orderStats.totalRevenue,
//               pendingRequests: requestStats.pending
//             }}
//             stockOrders={stockOrders}
//             stockBooks={stockBooks}
//             onAddBook={() => setShowAddBookModal(true)}
//             onAddSupplier={() => setShowAddSupplierModal(true)}
//             onViewRequests={() => handleTabChange(TAB_NAMES.BOOK_REQUESTS)}
//             onGenerateReports={() => handleTabChange(TAB_NAMES.REPORTS)}
//             onManagePopularBooks={() => handleTabChange(TAB_NAMES.POPULAR_BOOKS)}
//             onViewOrder={handleViewOrder}
//             onUpdateTracking={handleUpdateTracking}
//             onRestockBook={handleRestockBook}
//           />
//         );
      
//       case TAB_NAMES.INVENTORY:
//         return (
//           <InventoryTab
//             inventoryStats={inventoryStats}
//             stockBooks={stockBooks}
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             sortConfig={sortConfig}
//             handleSort={handleSort}
//             onAddBook={() => setShowAddBookModal(true)}
//             onEditBook={handleEditBook}
//             onRestockBook={handleRestockBook}
//             onToggleFeatured={handleToggleFeatured}
//             onDeleteBook={handleDeleteBook}
//             filteredBooks={filteredBooks}
//             sortedBooks={sortedBooks}
//           />
//         );
      
//       case TAB_NAMES.ORDERS:
//         return (
//           <OrdersTab
//             orderStats={orderStats}
//             stockOrders={stockOrders}
//             onViewOrder={handleViewOrder}
//             onShipOrder={handleShipOrder}
//             onUpdateTracking={handleUpdateTracking}
//           />
//         );
      
//       case TAB_NAMES.REPORTS:
//         return (
//           <ReportsTab
//             inventoryStats={inventoryStats}
//             orderStats={orderStats}
//             stockBooks={stockBooks}
//           />
//         );
      
//       case TAB_NAMES.SUPPLIERS:
//         return (
//           <SuppliersTab
//             suppliers={suppliers}
//             onAddSupplier={() => setShowAddSupplierModal(true)}
//             onContactSupplier={handleContactSupplier}
//             onDeleteSupplier={handleDeleteSupplier}
//           />
//         );
      
//       case TAB_NAMES.BOOK_REQUESTS:
//         return (
//           <BookRequestsTab
//             requestStats={requestStats}
//             bookRequests={bookRequests}
//             onViewRequestDetails={handleViewRequestDetails}
//             onApproveRequest={handleApproveRequest}
//             onRejectRequest={handleRejectRequest}
//           />
//         );
      
//       case TAB_NAMES.POPULAR_BOOKS:
//         return (
//           <PopularBooksTab
//             stockBooks={stockBooks}
//             inventoryStats={inventoryStats}
//             onToggleFeatured={handleToggleFeatured}
//             onRestockBook={handleRestockBook}
//             onEditBook={handleEditBook}
//           />
//         );
      
//       default:
//         return (
//           <DashboardTab
//             stats={{
//               totalBooks: inventoryStats.totalBooks,
//               lowStockItems: inventoryStats.lowStockItems,
//               processingOrders: orderStats.processing,
//               totalRevenue: orderStats.totalRevenue,
//               pendingRequests: requestStats.pending
//             }}
//             stockOrders={stockOrders}
//             stockBooks={stockBooks}
//             onAddBook={() => setShowAddBookModal(true)}
//             onAddSupplier={() => setShowAddSupplierModal(true)}
//             onViewRequests={() => handleTabChange(TAB_NAMES.BOOK_REQUESTS)}
//             onGenerateReports={() => handleTabChange(TAB_NAMES.REPORTS)}
//             onManagePopularBooks={() => handleTabChange(TAB_NAMES.POPULAR_BOOKS)}
//             onViewOrder={handleViewOrder}
//             onUpdateTracking={handleUpdateTracking}
//             onRestockBook={handleRestockBook}
//           />
//         );
//     }
//   };

//   if (loading || !currentUser) {
//     return (
//       <div className="stock-manager">
//         <Header />
//         <div className="text-center py-5">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading stock manager...</span>
//           </div>
//           <p className="mt-3">Loading stock manager...</p>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="stock-manager">
//       <Header />
      
//       <div className="container-fluid mt-4">
//         <div className="row">
//           {/* Sidebar */}
//           <div className="col-lg-2">
//             <Sidebar 
//               activeTab={activeTab}
//               onTabChange={handleTabChange}
//               stats={sidebarStats}
//             />
//           </div>

//           {/* Main Content */}
//           <div className="col-lg-10">
//             <div className="tab-content">
//               {renderActiveTab()}
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />

//       {/* Modals */}
//       <AddBookModal
//         show={showAddBookModal}
//         onClose={() => setShowAddBookModal(false)}
//         newBook={newBook}
//         setNewBook={setNewBook}
//         onSubmit={handleAddBook}
//         isEditing={!!newBook.id}
//       />

//       <AddSupplierModal
//         show={showAddSupplierModal}
//         onClose={() => setShowAddSupplierModal(false)}
//         newSupplier={newSupplier}
//         setNewSupplier={setNewSupplier}
//         onSubmit={handleAddSupplier}
//       />

//       <TrackingModal
//         show={showTrackingModal}
//         onClose={() => setShowTrackingModal(false)}
//         selectedOrder={selectedOrder}
//         trackingUpdate={trackingUpdate}
//         setTrackingUpdate={setTrackingUpdate}
//         onSubmit={handleSaveTracking}
//       />

//       <RequestDetailsModal
//         show={showRequestDetailsModal}
//         onClose={() => setShowRequestDetailsModal(false)}
//         selectedRequest={selectedRequest}
//         stock_managerNotes={stock_managerNotes}
//         setstock_managerNotes={setstock_managerNotes}
//         onApprove={(requestId, notes) => handleApproveRequest(requestId, notes)}
//         onReject={(requestId, notes) => handleRejectRequest(requestId, notes)}
//       />
//     </div>
//   );
// };

// export default StockManager;









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
import SuppliersTab from "../components/StockManager/Tabs/SuppliersTab";
import BookRequestsTab from "../components/StockManager/Tabs/BookRequestsTab";
import PopularBooksTab from "../components/StockManager/Tabs/PopularBooksTab";
import AddBookModal from "../components/StockManager/Modals/AddBookModal";
import AddSupplierModal from "../components/StockManager/Modals/AddSupplierModal";
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
  initialSuppliers
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
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stock_managerNotes, setstock_managerNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Form states
  const [newBook, setNewBook] = useState({
    isbn: "",
    title: "",
    author: "",
    category: "Fiction",
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
  });

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    paymentTerms: "30 days",
    leadTime: "7",
    rating: 5,
  });

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

  const [suppliers, setSuppliers] = useState(() => {
    if (typeof window === "undefined") return initialSuppliers();
    const stored = JSON.parse(window.localStorage.getItem("suppliers"));
    return stored || initialSuppliers();
  });

  const [bookRequests, setBookRequests] = useState(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(window.localStorage.getItem("bookRequests")) || [];
  });

  const loadAllData = useCallback(() => {
    if (typeof window === "undefined") return;

    const storedRequests = JSON.parse(window.localStorage.getItem("bookRequests")) || [];
    setBookRequests(storedRequests);

    const storedBooks = JSON.parse(window.localStorage.getItem("stockBooks"));
    if (storedBooks) setStockBooks(storedBooks);

    const storedSuppliers = JSON.parse(window.localStorage.getItem("suppliers"));
    if (storedSuppliers) setSuppliers(storedSuppliers);

    const storedOrders = JSON.parse(window.localStorage.getItem("stockOrders"));
    if (storedOrders) setStockOrders(storedOrders);
  }, []);

  const handleStorageChange = useCallback(
    (e) => {
      if (typeof window === "undefined") return;

      if (
        e.key === "stockBooks" ||
        e.key === "suppliers" ||
        e.key === "stockOrders" ||
        e.key === "bookRequests"
      ) {
        loadAllData();
      }

      if (e.key === "currentUser") {
        try {
          const updatedUser = JSON.parse(window.localStorage.getItem("currentUser"));
          setCurrentUser(updatedUser);
        } catch (error) {
          console.error("Failed to parse currentUser from storage", error);
          setCurrentUser(null);
        }
      }
    },
    [loadAllData, setCurrentUser]
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

  const handleInputChange = (setter) => (e) => {
    const { name, value, type, checked } = e.target;
    setter(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
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
      costPrice: parseFloat(newBook.costPrice) || parseFloat(newBook.price) * 0.6,
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
    setNewBook({
      isbn: "",
      title: "",
      author: "",
      category: "Fiction",
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
    });

    setShowAddBookModal(false);
    showNotification("Book added successfully!", "success");
    window.dispatchEvent(new Event("storage"));
  };

  const handleAddSupplier = (e) => {
    e.preventDefault();

    if (!newSupplier.name || !newSupplier.contact || !newSupplier.email) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    const newSupplierObj = {
      id: `SUP${String(suppliers.length + 1).padStart(3, "0")}`,
      name: newSupplier.name,
      contact: newSupplier.contact,
      email: newSupplier.email,
      phone: newSupplier.phone,
      address: newSupplier.address,
      website: newSupplier.website,
      booksSupplied: 0,
      status: "Active",
      rating: parseFloat(newSupplier.rating),
      paymentTerms: newSupplier.paymentTerms,
      leadTime: newSupplier.leadTime,
      lastOrder: null,
      createdAt: new Date().toISOString(),
    };

    const updatedSuppliers = [...suppliers, newSupplierObj];
    setSuppliers(updatedSuppliers);
    localStorage.setItem("suppliers", JSON.stringify(updatedSuppliers));

    // Reset form
    setNewSupplier({
      name: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      paymentTerms: "30 days",
      leadTime: "7",
      rating: 5,
    });

    setShowAddSupplierModal(false);
    showNotification("Supplier added successfully!", "success");
  };

  const handleDeleteBook = (bookId) => {
    if (window.confirm("Are you sure you want to delete this book from inventory?")) {
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
      });
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
          : order
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

    const trackingUpdates = JSON.parse(localStorage.getItem("orderTrackingUpdates")) || [];

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
    localStorage.setItem("orderTrackingUpdates", JSON.stringify(trackingUpdates));

    // Update order status
    const updatedOrders = stockOrders.map((order) =>
      order.id === selectedOrder.id
        ? {
            ...order,
            status: trackingUpdate.status,
            courier: trackingUpdate.courier,
            trackingNumber: trackingUpdate.trackingNumber,
          }
        : order
    );

    setStockOrders(updatedOrders);
    localStorage.setItem("stockOrders", JSON.stringify(updatedOrders));

    setShowTrackingModal(false);
    showNotification("Tracking updated successfully!", "success");
  };

  const handleContactSupplier = (supplierId) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    if (supplier) {
      window.location.href = `mailto:${supplier.email}`;
    }
  };

  const handleDeleteSupplier = (supplierId) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      const updatedSuppliers = suppliers.filter((s) => s.id !== supplierId);
      setSuppliers(updatedSuppliers);
      localStorage.setItem("suppliers", JSON.stringify(updatedSuppliers));
      showNotification("Supplier deleted successfully", "success");
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
      book.id === bookId ? { ...book, featured: !book.featured } : book
    );
    
    setStockBooks(updatedBooks);
    localStorage.setItem("stockBooks", JSON.stringify(updatedBooks));
    
    const book = updatedBooks.find(b => b.id === bookId);
    showNotification(
      book.featured 
        ? "Book marked as featured for home page" 
        : "Book removed from featured",
      "success"
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
            onAddBook={() => setShowAddBookModal(true)}
            onAddSupplier={() => setShowAddSupplierModal(true)}
            onViewRequests={() => handleTabChange("book-requests")}
            onViewReports={() => handleTabChange("reports")}
            onManagePopularBooks={() => handleTabChange("popular-books")}
            onViewOrders={() => handleTabChange("orders")}
            orders={stockOrders}
            lowStockBooks={stockBooks.filter(
              (book) => book.status === "Low Stock" || book.status === "Out of Stock"
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
            onAddBook={() => setShowAddBookModal(true)}
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
      case "suppliers":
        return (
          <SuppliersTab
            suppliers={suppliers}
            onAddSupplier={() => setShowAddSupplierModal(true)}
            onContactSupplier={handleContactSupplier}
            onDeleteSupplier={handleDeleteSupplier}
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
            popularBooks={[...stockBooks].sort((a, b) => b.salesThisMonth - a.salesThisMonth).slice(0, 12)}
            featuredBooks={stockBooks.filter(book => book.featured)}
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
            onAddBook={() => setShowAddBookModal(true)}
            onAddSupplier={() => setShowAddSupplierModal(true)}
            onViewRequests={() => handleTabChange("book-requests")}
            onViewReports={() => handleTabChange("reports")}
            onManagePopularBooks={() => handleTabChange("popular-books")}
            onViewOrders={() => handleTabChange("orders")}
            orders={stockOrders}
            lowStockBooks={stockBooks.filter(
              (book) => book.status === "Low Stock" || book.status === "Out of Stock"
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

      <AddBookModal
        show={showAddBookModal}
        onClose={() => setShowAddBookModal(false)}
        newBook={newBook}
        onInputChange={handleInputChange(setNewBook)}
        onSubmit={handleAddBook}
        isEditing={!!newBook.id}
      />

      <AddSupplierModal
        show={showAddSupplierModal}
        onClose={() => setShowAddSupplierModal(false)}
        newSupplier={newSupplier}
        onInputChange={handleInputChange(setNewSupplier)}
        onSubmit={handleAddSupplier}
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