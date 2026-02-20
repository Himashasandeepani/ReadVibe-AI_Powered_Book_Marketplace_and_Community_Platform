import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Modal, Button, Badge, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faUser,
  faStar,
  faTimes,
  faHeart,
  faShoppingCart,
  faTruck,
  faInfoCircle,
  faPrint,
  faCalendar,
  faBarcode,
  faLanguage,
  faComments,
  faStore,
  faChartLine,
  faBookmark,
  faBookOpen,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import {
  formatPrice,
  generateStarRating,
  addToWishlist,
  showNotification,
} from "../../utils/helpers";
import { addItem, setCart } from "../../store/slices/cartSlice";

const BookDetailsModal = ({ show, onHide, book, currentUser }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!book) return null;

  const isLoggedIn = () => currentUser !== null;

  const isInWishlist = (bookId) => {
    if (!currentUser) return false;
    const wishlist =
      JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`)) || [];
    return wishlist.some((item) => item.id === bookId);
  };

  const handleAddToWishlist = () => {
    if (!isLoggedIn()) {
      onHide();
      navigate("/login");
      return;
    }

    addToWishlist(book.id, currentUser.id);
    window.dispatchEvent(new CustomEvent("wishlist-updated"));
    showNotification("Book added to wishlist!", "success");
  };

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      onHide();
      navigate("/login");
      return;
    }

    if (book.stock === 0 || !book.inStock) {
      showNotification("This book is currently out of stock", "warning");
      return;
    }

    dispatch(
      addItem({
        id: book.id,
        title: book.title,
        price: book.price,
        quantity: 1,
        image: book.image,
        stock: book.stock,
      }),
    );
    showNotification("Book added to cart!", "success");
  };

  const handleBuyNow = () => {
    if (!isLoggedIn()) {
      onHide();
      navigate("/login");
      return;
    }

    if (book.stock === 0 || !book.inStock) {
      showNotification("This book is currently out of stock", "warning");
      return;
    }

    dispatch(
      setCart([
        {
          id: book.id,
          title: book.title,
          price: book.price,
          quantity: 1,
          image: book.image,
          stock: book.stock,
        },
      ]),
    );
    sessionStorage.setItem(
      "checkoutCart",
      JSON.stringify([
        {
          id: book.id,
          quantity: 1,
        },
      ]),
    );
    onHide();
    navigate("/delivery-details");
  };

  const getStockBadge = () => {
    if (book.stock > 10) {
      return <Badge bg="success">In Stock</Badge>;
    } else if (book.stock > 0) {
      return <Badge bg="warning">Low Stock</Badge>;
    } else {
      return <Badge bg="danger">Out of Stock</Badge>;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" animation={true} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faBook} className="me-2" />
          {book.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={4}>
            <div className="text-center">
              <img
                src={book.image}
                alt={book.title}
                className="img-fluid rounded mb-3"
                style={{ maxHeight: "300px" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/default_book.jpg";
                }}
              />
              <div className="mb-3">
                {getStockBadge()}
                {book.salesThisMonth > 0 && (
                  <Badge bg="info" className="ms-2">
                    <FontAwesomeIcon icon={faFire} className="me-1" />
                    {book.salesThisMonth} sold this month
                  </Badge>
                )}
              </div>
            </div>
          </Col>

          <Col md={8}>
            <h4>
              <FontAwesomeIcon icon={faUser} className="me-2" />
              by {book.author}
            </h4>

            <div className="d-flex align-items-center mb-3">
              <div className="rating-badge">
                <FontAwesomeIcon icon={faStar} className="me-1" />
                {generateStarRating(book.rating)} ({book.reviews} reviews)
              </div>
              <span className="ms-3 fs-5 fw-bold">
                {formatPrice(book.price)}
              </span>
            </div>

            <div className="mb-3">
              <span className="badge bg-primary me-2">
                <FontAwesomeIcon icon={faBookmark} className="me-1" />
                {book.category}
              </span>
              <span className="badge bg-secondary me-2">
                <FontAwesomeIcon icon={faBookOpen} className="me-1" />
                {book.pages || "N/A"} pages
              </span>
              {book.stock > 0 && (
                <span className="badge bg-success">
                  <FontAwesomeIcon icon={faStore} className="me-1" />
                  {book.stock} in stock
                </span>
              )}
            </div>

            <p className="mb-4">
              {book.description || "No description available."}
            </p>

            <div className="mb-4">
              <h5>
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Details
              </h5>
              <ul className="list-unstyled">
                <li>
                  <strong>
                    <FontAwesomeIcon icon={faPrint} className="me-2" />
                    Publisher:
                  </strong>{" "}
                  {book.publisher || "Not specified"}
                </li>
                <li>
                  <strong>
                    <FontAwesomeIcon icon={faCalendar} className="me-2" />
                    Published:
                  </strong>{" "}
                  {book.publishedDate || "Not specified"}
                </li>
                <li>
                  <strong>
                    <FontAwesomeIcon icon={faBarcode} className="me-2" />
                    ISBN:
                  </strong>{" "}
                  {book.isbn || "Not specified"}
                </li>
                <li>
                  <strong>
                    <FontAwesomeIcon icon={faLanguage} className="me-2" />
                    Language:
                  </strong>{" "}
                  {book.language || "English"}
                </li>
                {book.salesThisMonth > 0 && (
                  <li>
                    <strong>
                      <FontAwesomeIcon icon={faChartLine} className="me-2" />
                      Monthly Sales:
                    </strong>{" "}
                    {book.salesThisMonth} copies
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h5>
                <FontAwesomeIcon icon={faComments} className="me-2" />
                Customer Reviews
              </h5>
              <div className="mb-3 p-3 border rounded">
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold fs-5 me-2">
                    <FontAwesomeIcon icon={faUser} className="me-1" />
                    Verified Reader
                  </span>
                  <span className="text-warning">{generateStarRating(5)}</span>
                </div>
                <p className="mb-0">
                  Sold {book.salesThisMonth || 0} copies this month! Highly
                  recommended.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <FontAwesomeIcon icon={faTimes} className="me-2" />
          Close
        </Button>

        {isLoggedIn() ? (
          <>
            <Button
              variant={isInWishlist(book.id) ? "danger" : "outline-danger"}
              onClick={handleAddToWishlist}
              className="book-action-btn"
            >
              <FontAwesomeIcon
                icon={isInWishlist(book.id) ? faHeart : faHeartRegular}
                className="me-2"
              />
              {isInWishlist(book.id)
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </Button>
            <Button
              variant="outline-primary"
              onClick={handleAddToCart}
              className="book-action-btn"
              disabled={!book.inStock || book.stock === 0}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              Add to Cart
            </Button>
            <Button
              variant="primary"
              onClick={handleBuyNow}
              className="book-action-btn"
              disabled={!book.inStock || book.stock === 0}
            >
              <FontAwesomeIcon icon={faTruck} className="me-2" />
              Buy Now
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline-danger"
              onClick={() => {
                onHide();
                navigate("/login");
              }}
              className="book-action-btn"
            >
              <FontAwesomeIcon icon={faHeartRegular} className="me-2" />
              Login for Wishlist
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => {
                onHide();
                navigate("/login");
              }}
              className="book-action-btn"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              Login to Add to Cart
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onHide();
                navigate("/login");
              }}
              className="book-action-btn"
            >
              <FontAwesomeIcon icon={faTruck} className="me-2" />
              Login to Buy
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default BookDetailsModal;
