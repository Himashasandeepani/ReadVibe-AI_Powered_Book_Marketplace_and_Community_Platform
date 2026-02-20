import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Badge,
  Pagination,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faBook,
  faRocket,
  faDragon,
  faSearch as faSearchIcon,
  faHeart,
  faGlasses,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  books,
  formatPrice,
  generateStarRating,
  searchBooks,
  filterBooks,
  showNotification,
  addToWishlist,
} from "../utils/helpers";
import { addItem, setCart } from "../store/slices/cartSlice";
import "../styles/pages/Marketplace.css";

// Components
import BookDetailsModal from "../components/Marketplace/BookDetailsModal";
import BookCard from "../components/Marketplace/BookCard";
import CategorySection from "../components/Marketplace/CategorySection";
import FilterSection from "../components/Marketplace/FilterSection";
import ActiveFilters from "../components/Marketplace/ActiveFilters";
import PaginationSection from "../components/Marketplace/PaginationSection";
import GuestNotice from "../components/Marketplace/GuestNotice";
import SearchBar from "../components/Marketplace/SearchBar";
import EmptyState from "../components/Marketplace/EmptyState";

const getStoredUser = () => {
  const storedUser = localStorage.getItem("currentUser");
  return storedUser ? JSON.parse(storedUser) : null;
};

const getStoredWishlist = (targetUser) => {
  if (!targetUser) return [];
  return JSON.parse(localStorage.getItem(`wishlist_${targetUser.id}`)) || [];
};

const DEFAULT_FILTERS = {
  category: "all",
  minPrice: 0,
  maxPrice: 10000,
  minRating: 4.0,
  inStock: true,
  preOrder: false,
};

const Marketplace = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(() => ({ ...DEFAULT_FILTERS }));
  const [filteredBooks, setFilteredBooks] = useState(() =>
    filterBooks(DEFAULT_FILTERS, books),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(12);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [user, setUser] = useState(() => getStoredUser());
  const [userWishlist, setUserWishlist] = useState(() =>
    getStoredWishlist(getStoredUser()),
  );
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  const applyFilters = useCallback(() => {
    const filtered = filterBooks(filters, books);
    setFilteredBooks(filtered);
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = getStoredUser();
      setUser(storedUser);
      setUserWishlist(getStoredWishlist(storedUser));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
      const results = searchBooks(query);
      setFilteredBooks(results);
      setCurrentPage(1);
    } else if (query.length === 0) {
      applyFilters();
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const changeRating = (change) => {
    let newRating = parseFloat(filters.minRating) + change * 0.5;
    newRating = Math.max(0.5, Math.min(5.0, newRating));
    setFilters((prev) => ({
      ...prev,
      minRating: newRating,
    }));
  };

  const resetFilters = () => {
    const resetState = { ...DEFAULT_FILTERS };
    setFilters(resetState);
    setSearchQuery("");
    setFilteredBooks(filterBooks(resetState, books));
    setCurrentPage(1);
  };

  const validatePriceRange = () => {
    const minPrice = parseInt(filters.minPrice, 10) || 0;
    const maxPrice = parseInt(filters.maxPrice, 10) || 10000;

    if (minPrice > maxPrice) {
      showNotification(
        "Minimum price cannot be greater than maximum price",
        "danger",
      );
      return false;
    }
    return true;
  };

  const handleApplyFilters = () => {
    if (validatePriceRange()) {
      applyFilters();
      setIsFilterCollapsed(false);
      showNotification("Filters applied successfully!", "success");
    }
  };

  const isLoggedIn = () => {
    return user !== null;
  };

  const requireLogin = (actionName) => {
    if (!isLoggedIn()) {
      showNotification(`Please login to ${actionName}`, "warning");
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleAddToCart = (bookId, e = null) => {
    if (e) e.stopPropagation();

    if (!requireLogin("add items to cart")) return;

    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook) return;
    if (!targetBook.inStock || targetBook.stock === 0) {
      showNotification("This book is currently out of stock", "warning");
      return;
    }

    dispatch(
      addItem({
        id: targetBook.id,
        title: targetBook.title,
        price: targetBook.price,
        quantity: 1,
        image: targetBook.image,
        stock: targetBook.stock,
      }),
    );
    showNotification("Book added to cart!", "success");
  };

  const handleBuyNow = (bookId, e = null) => {
    if (e) e.stopPropagation();

    if (!requireLogin("buy books")) return;

    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook || !targetBook.inStock || targetBook.stock === 0) {
      showNotification("This book is currently out of stock", "warning");
      return;
    }

    // Set cart to this single item and persist for checkout flow
    const payload = [
      {
        id: targetBook.id,
        title: targetBook.title,
        price: targetBook.price,
        quantity: 1,
        image: targetBook.image,
        stock: targetBook.stock,
      },
    ];

    dispatch(setCart(payload));
    sessionStorage.setItem("checkoutCart", JSON.stringify(payload));
    showNotification("Proceeding to delivery details", "success");
    navigate("/delivery-details");
  };

  const handleAddToWishlist = (bookId, e = null) => {
    if (e) e.stopPropagation();

    if (!requireLogin("add items to wishlist")) return;

    addToWishlist(bookId, user.id);
    const updatedWishlist =
      JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
    setUserWishlist(updatedWishlist);

    window.dispatchEvent(new CustomEvent("wishlist-updated"));
    showNotification("Book added to wishlist!", "success");
  };

  const isInWishlist = (bookId) => {
    return userWishlist.some((item) => item.id === bookId);
  };

  const handleViewDetails = (book) => {
    setSelectedBook(book);
    setShowBookModal(true);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Fiction: faBook,
      "Science Fiction": faRocket,
      Fantasy: faDragon,
      Mystery: faSearchIcon,
      Romance: faHeart,
      "Non-Fiction": faGlasses,
    };
    return icons[category] || faBook;
  };

  // Group books by category
  const groupBooksByCategory = (booksArray) => {
    const grouped = {};

    booksArray.forEach((book) => {
      if (!grouped[book.category]) {
        grouped[book.category] = [];
      }
      grouped[book.category].push(book);
    });

    return grouped;
  };

  // Change page with scroll
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Filter by category with scroll
  const filterByCategory = (category) => {
    setFilters((prev) => ({ ...prev, category }));
    setCurrentPage(1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Show all books in category with scroll
  const showAllBooksInCategory = (category) => {
    setFilters((prev) => ({ ...prev, category }));
    setCurrentPage(1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Tooltips
  const wishlistTooltip = (props) => (
    <Tooltip id="wishlist-tooltip" {...props}>
      {isLoggedIn() ? "Add to Wishlist" : "Login to add to wishlist"}
    </Tooltip>
  );

  const cartTooltip = (props) => (
    <Tooltip id="cart-tooltip" {...props}>
      {isLoggedIn() ? "Add to Cart" : "Login to add to cart"}
    </Tooltip>
  );

  const buyNowTooltip = (props) => (
    <Tooltip id="buynow-tooltip" {...props}>
      {isLoggedIn() ? "Buy Now" : "Login to buy"}
    </Tooltip>
  );

  // Render book card function
  const renderBookCard = (book) => (
    <Col lg={3} md={4} sm={6} key={book.id} className="mb-4">
      <BookCard
        book={book}
        isLoggedIn={isLoggedIn()}
        isInWishlist={isInWishlist}
        onViewDetails={handleViewDetails}
        onAddToWishlist={handleAddToWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        navigate={navigate}
        wishlistTooltip={wishlistTooltip}
        cartTooltip={cartTooltip}
        buyNowTooltip={buyNowTooltip}
        formatPrice={formatPrice}
        generateStarRating={generateStarRating}
      />
    </Col>
  );

  // Render books by category view
  const renderBooksByCategory = () => {
    if (filters.category !== "all") {
      // Show only selected category
      const categoryBooks = filteredBooks.filter(
        (book) => book.category === filters.category,
      );

      if (categoryBooks.length === 0) {
        return <EmptyState resetFilters={resetFilters} />;
      }

      return (
        <div className="category-section mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="category-title mb-0">
              <FontAwesomeIcon
                icon={getCategoryIcon(filters.category)}
                className="me-2"
                style={{ color: "var(--primary-blue)" }}
              />
              {filters.category}
              <Badge bg="secondary" className="ms-2">
                {categoryBooks.length} books
              </Badge>
            </h3>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => filterByCategory("all")}
            >
              <FontAwesomeIcon icon={faChevronRight} className="me-1" />
              Back to Categories
            </Button>
          </div>

          <Row>{categoryBooks.map((book) => renderBookCard(book))}</Row>
        </div>
      );
    }

    // Group books by category
    const groupedBooks = groupBooksByCategory(filteredBooks);
    const categories = Object.keys(groupedBooks).sort();

    if (categories.length === 0) {
      return <EmptyState resetFilters={resetFilters} />;
    }

    return categories.map((category) => (
      <CategorySection
        key={category}
        category={category}
        books={groupedBooks[category]}
        filterByCategory={filterByCategory}
        showAllBooksInCategory={showAllBooksInCategory}
        renderBookCard={renderBookCard}
        getCategoryIcon={getCategoryIcon}
        formatPrice={formatPrice}
        generateStarRating={generateStarRating}
        isLoggedIn={isLoggedIn()}
        isInWishlist={isInWishlist}
        onViewDetails={handleViewDetails}
        onAddToWishlist={handleAddToWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        navigate={navigate}
        wishlistTooltip={wishlistTooltip}
        cartTooltip={cartTooltip}
        buyNowTooltip={buyNowTooltip}
      />
    ));
  };

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <>
      <BookDetailsModal
        show={showBookModal}
        onHide={() => setShowBookModal(false)}
        book={selectedBook}
        isLoggedIn={isLoggedIn()}
        isInWishlist={isInWishlist}
        onAddToWishlist={handleAddToWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        navigate={navigate}
        formatPrice={formatPrice}
        generateStarRating={generateStarRating}
      />

      <Container className="py-4 marketplace-page">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0" style={{ color: "var(--primary-blue)" }}>
            <FontAwesomeIcon icon={faBookmark} className="me-2" />
            Book Marketplace
          </h2>

          <SearchBar
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            isFilterCollapsed={isFilterCollapsed}
            setIsFilterCollapsed={setIsFilterCollapsed}
          />
        </div>

        <GuestNotice user={user} />

        <FilterSection
          isFilterCollapsed={isFilterCollapsed}
          setIsFilterCollapsed={setIsFilterCollapsed}
          filters={filters}
          setFilters={setFilters}
          handleFilterChange={handleFilterChange}
          changeRating={changeRating}
          resetFilters={resetFilters}
          handleApplyFilters={handleApplyFilters}
          filteredBooks={filteredBooks}
        />

        <ActiveFilters
          filters={filters}
          setFilters={setFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div id="booksContainerByCategory">{renderBooksByCategory()}</div>

        <PaginationSection
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
          filteredBooks={filteredBooks}
          booksPerPage={booksPerPage}
          filters={filters}
        />
      </Container>
    </>
  );
};

export default Marketplace;
