import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Import Components
import GuestRestriction from "../components/Wishlist/GuestRestriction";
import PageHeader from "../components/Wishlist/PageHeader";
import FiltersBar from "../components/Wishlist/FiltersBar";
import WishlistItem from "../components/Wishlist/WishlistItem";
import EmptyWishlist from "../components/Wishlist/EmptyWishlist";
import SummaryCard from "../components/Wishlist/SummaryCard";
import QuickActions from "../components/Wishlist/QuickActions";
import AddBookModal from "../components/Wishlist/AddBookModal";
import EditItemModal from "../components/Wishlist/EditItemModal";

// Import Utilities
import {
  sampleBooks,
  applyFilter,
  sortWishlist,
  // ... other imports
} from "../components/Wishlist/utils.jsx";

import { showNotification } from "../utils/helpers";
import "../styles/pages/Wishlist.css";

const Wishlist = () => {
  const navigate = useNavigate();

  // State management
  const [wishlist, setWishlist] = useState([]);
  const [filteredWishlist, setFilteredWishlist] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [user, setUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [priority, setPriority] = useState(3);
  const [notes, setNotes] = useState("");
  const [sortOrder, setSortOrder] = useState("priority");
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    price: "",
    category: "Fiction",
  });

  // Load wishlist and user data
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(currentUser);

    if (currentUser) {
      const userWishlist =
        JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`)) || [];
      
      if (userWishlist.length === 0) {
        // Add sample data for demo if empty
        const sampleWishlist = [
          {
            ...sampleBooks[0],
            priority: 5,
            notes: "Really want to read this!",
            dateAdded: new Date().toISOString(),
            userId: currentUser.id,
          },
          {
            ...sampleBooks[1],
            priority: 4,
            notes: "Great reviews from friends",
            dateAdded: new Date().toISOString(),
            userId: currentUser.id,
          },
          {
            ...sampleBooks[2],
            priority: 3,
            notes: "Classic sci-fi masterpiece",
            dateAdded: new Date().toISOString(),
            userId: currentUser.id,
          },
        ];
        localStorage.setItem(
          `wishlist_${currentUser.id}`,
          JSON.stringify(sampleWishlist)
        );
        setWishlist(sampleWishlist);
        setFilteredWishlist(sampleWishlist);
      } else {
        setWishlist(userWishlist);
        setFilteredWishlist(userWishlist);
      }
    }
  }, []);

  // Save wishlist to localStorage
  const saveWishlist = (updatedWishlist) => {
    if (!user) return;
    localStorage.setItem(
      `wishlist_${user.id}`,
      JSON.stringify(updatedWishlist)
    );
  };

  // Apply filters to wishlist
  const handleApplyFilter = (filter) => {
    setCurrentFilter(filter);
    const filtered = applyFilter(wishlist, filter);
    setFilteredWishlist(filtered);
  };

  // Sort wishlist
  const handleSortWishlist = (sortType) => {
    setSortOrder(sortType);
    const sorted = sortWishlist(wishlist, sortType);
    setWishlist(sorted);
    setFilteredWishlist(sorted);
    saveWishlist(sorted);
  };

  // Search books
  const handleSearchBooks = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const results = sampleBooks
      .filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((book) => !wishlist.some((item) => item.id === book.id));

    setSearchResults(results);
  };

  // Add to wishlist
  const handleAddToWishlist = (
    book,
    priorityLevel = priority,
    notesText = notes
  ) => {
    if (!user) {
      showNotification("Please login to add items to wishlist", "warning");
      navigate("/login");
      return false;
    }

    const existingItem = wishlist.find((item) => item.id === book.id);
    if (existingItem) {
      showNotification("This book is already in your wishlist", "info");
      return false;
    }

    const wishlistItem = {
      ...book,
      priority: priorityLevel,
      notes: notesText,
      dateAdded: new Date().toISOString(),
      userId: user.id,
    };

    const updatedWishlist = [...wishlist, wishlistItem];
    setWishlist(updatedWishlist);
    setFilteredWishlist(updatedWishlist);
    saveWishlist(updatedWishlist);

    showNotification("Book added to wishlist!", "success");
    window.dispatchEvent(new CustomEvent("wishlist-updated"));

    // Reset form
    setSearchTerm("");
    setSearchResults([]);
    setPriority(3);
    setNotes("");
    setShowAddModal(false);

    return true;
  };

  // Add custom book to wishlist
  const handleAddCustomBook = () => {
    if (!user) {
      showNotification("Please login to add items to wishlist", "warning");
      navigate("/login");
      return;
    }

    if (!newBook.title || !newBook.author || !newBook.price) {
      showNotification("Please fill in all required fields", "warning");
      return;
    }

    const customBook = {
      id: Date.now(),
      title: newBook.title,
      author: newBook.author,
      price: parseFloat(newBook.price),
      category: newBook.category,
      rating: 0,
      reviews: 0,
      inStock: true,
      image:
        "https://via.placeholder.com/200x300/DBEAFE/1E3A5F?text=Custom+Book",
    };

    handleAddToWishlist(customBook, priority, notes);
    setNewBook({
      title: "",
      author: "",
      price: "",
      category: "Fiction",
    });
  };

  // Remove from wishlist
  const handleRemoveFromWishlist = (bookId) => {
    if (!window.confirm("Remove this book from your wishlist?")) return;

    const updatedWishlist = wishlist.filter((item) => item.id !== bookId);
    setWishlist(updatedWishlist);
    setFilteredWishlist(updatedWishlist);
    saveWishlist(updatedWishlist);

    window.dispatchEvent(new CustomEvent("wishlist-updated"));
    showNotification("Book removed from wishlist", "info");
  };

  // Clear wishlist
  const handleClearWishlist = () => {
    if (
      !window.confirm(
        "Clear your entire wishlist? This action cannot be undone."
      )
    )
      return;

    if (wishlist.length === 0) {
      showNotification("Your wishlist is already empty", "info");
      return;
    }

    setWishlist([]);
    setFilteredWishlist([]);
    saveWishlist([]);

    window.dispatchEvent(new CustomEvent("wishlist-updated"));
    showNotification("Wishlist cleared", "info");
  };

  // Edit wishlist item
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setPriority(item.priority || 3);
    setNotes(item.notes || "");
    setShowEditModal(true);
  };

  // Update wishlist item
  const handleUpdateItem = () => {
    if (!selectedItem) return;

    const updatedWishlist = wishlist.map((item) =>
      item.id === selectedItem.id ? { ...item, priority, notes } : item
    );

    setWishlist(updatedWishlist);
    setFilteredWishlist(updatedWishlist);
    saveWishlist(updatedWishlist);
    setShowEditModal(false);

    showNotification("Wishlist item updated!", "success");
  };

  // Add to cart from wishlist
  const handleAddToCart = (bookId) => {
    if (!user) {
      showNotification("Please login to add items to cart", "warning");
      navigate("/login");
      return;
    }

    const book =
      sampleBooks.find((b) => b.id === bookId) ||
      wishlist.find((b) => b.id === bookId);
    if (!book || !book.inStock) {
      showNotification("This book is currently out of stock", "warning");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === bookId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        image: book.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    if (
      window.confirm(
        "Remove this book from wishlist since it's now in your cart?"
      )
    ) {
      handleRemoveFromWishlist(bookId);
    }

    showNotification("Book added to cart!", "success");
  };

  // Add all available to cart
  const handleAddAllToCart = () => {
    const availableItems = wishlist.filter((item) => item.inStock);

    if (availableItems.length === 0) {
      showNotification("No available items in your wishlist", "warning");
      return;
    }

    if (
      window.confirm(`Add ${availableItems.length} available items to cart?`)
    ) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      availableItems.forEach((item) => {
        const existingItem = cart.find((cartItem) => cartItem.id === item.id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({
            id: item.id,
            title: item.title,
            author: item.author,
            price: item.price,
            image: item.image,
            quantity: 1,
          });
        }
      });

      localStorage.setItem("cart", JSON.stringify(cart));

      const updatedWishlist = wishlist.filter((item) => !item.inStock);
      setWishlist(updatedWishlist);
      setFilteredWishlist(updatedWishlist);
      saveWishlist(updatedWishlist);

      showNotification(
        `${availableItems.length} items added to cart!`,
        "success"
      );
    }
  };

  // Share wishlist
  const handleShareWishlist = (method) => {
    if (!user) return;

    switch (method) {
      case "link":
        const shareableLink = `${window.location.origin}/wishlist-share?user=${user.id}`;
        navigator.clipboard
          .writeText(shareableLink)
          .then(() => showNotification("Link copied to clipboard!", "success"))
          .catch(() => showNotification("Failed to copy link", "danger"));
        break;
      case "email":
        const subject = `${user.name}'s ReadVibe Wishlist`;
        const body =
          `Check out my book wishlist on ReadVibe!\n\n` +
          `${wishlist
            .map(
              (item) =>
                `• ${item.title} by ${item.author} - LKR ${item.price.toFixed(
                  2
                )}`
            )
            .join("\n")}\n\n` +
          `Total: LKR ${wishlist
            .reduce((sum, item) => sum + item.price, 0)
            .toFixed(2)}\n\n` +
          `View my wishlist: ${window.location.origin}/wishlist-share?user=${user.id}`;

        window.location.href = `mailto:?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`;
        break;
    }
  };

  // Close add modal with reset
  const closeAddModal = () => {
    setShowAddModal(false);
    setSearchTerm("");
    setSearchResults([]);
    setNewBook({
      title: "",
      author: "",
      price: "",
      category: "Fiction",
    });
    setPriority(3);
    setNotes("");
  };

  return (
    <>
      <Container className="py-4 wishlist-page">
        <PageHeader wishlistCount={wishlist.length} />

        {!user ? (
          <GuestRestriction />
        ) : (
          <>
            <FiltersBar
              currentFilter={currentFilter}
              onFilterChange={handleApplyFilter}
              sortOrder={sortOrder}
              onSortChange={handleSortWishlist}
              onAddBook={() => setShowAddModal(true)}
            />

            <Row>
              {/* Wishlist Items */}
              <Col lg={9}>
                {filteredWishlist.length === 0 ? (
                  <EmptyWishlist onAddBook={() => setShowAddModal(true)} />
                ) : (
                  <Row>
                    {filteredWishlist.map((item) => (
                      <WishlistItem
                        key={item.id}
                        item={item}
                        onRemove={handleRemoveFromWishlist}
                        onEdit={handleEditItem}
                        onAddToCart={handleAddToCart}
                        onEditItem={handleEditItem}
                      />
                    ))}
                  </Row>
                )}
              </Col>

              {/* Sidebar */}
              <Col lg={3}>
                <SummaryCard
                  wishlist={wishlist}
                  onAddAllToCart={handleAddAllToCart}
                  onClearWishlist={handleClearWishlist}
                />

                <QuickActions
                  onSearchBooks={() => setShowAddModal(true)}
                  onShareLink={() => handleShareWishlist("link")}
                  onShareEmail={() => handleShareWishlist("email")}
                />
              </Col>
            </Row>
          </>
        )}
      </Container>

      <AddBookModal
        show={showAddModal}
        onHide={closeAddModal}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchResults={searchResults}
        onSearchBooks={handleSearchBooks}
        onAddToWishlist={handleAddToWishlist}
        newBook={newBook}
        setNewBook={setNewBook}
        priority={priority}
        setPriority={setPriority}
        notes={notes}
        setNotes={setNotes}
        onAddCustomBook={handleAddCustomBook}
      />

      <EditItemModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        selectedItem={selectedItem}
        priority={priority}
        setPriority={setPriority}
        notes={notes}
        setNotes={setNotes}
        onRemove={handleRemoveFromWishlist}
        onUpdate={handleUpdateItem}
      />

      {/* Modal backdrop */}
      {(showAddModal || showEditModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </>
  );
};

export default Wishlist;