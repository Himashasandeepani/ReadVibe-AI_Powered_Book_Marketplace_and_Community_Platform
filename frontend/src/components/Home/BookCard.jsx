import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Badge, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faUser,
  faStar,
  faTag,
  faChartLine,
  faHeart,
  faShoppingCart,
  faTruck,
  faTimes,
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

const BookCard = ({ book, currentUser, onViewDetails }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = () => currentUser !== null;

  const isInWishlist = (bookId) => {
    if (!currentUser) return false;
    const wishlist =
      JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`)) || [];
    return wishlist.some((item) => item.id === bookId);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();

    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    addToWishlist(book.id, currentUser.id);
    window.dispatchEvent(new CustomEvent("wishlist-updated"));
    showNotification("Book added to wishlist!", "success");
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!isLoggedIn()) {
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

  const handleBuyNow = (e) => {
    e.stopPropagation();

    if (!isLoggedIn()) {
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
    navigate("/delivery-details");
  };

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

  return (
    <div className="book-card" onClick={onViewDetails}>
      <div className="book-cover">
        <img
          src={book.image}
          alt={book.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/default_book.jpg";
          }}
        />
        {book.salesThisMonth > 5 && (
          <span className="badge bg-danger position-absolute top-0 end-0 m-2">
            <FontAwesomeIcon icon={faFire} className="me-1" />
            Hot!
          </span>
        )}
        {!book.inStock && (
          <span className="badge bg-danger position-absolute top-0 start-0 m-2">
            <FontAwesomeIcon icon={faTimes} className="me-1" />
            Out of Stock
          </span>
        )}
      </div>

      <div className="book-info">
        {book.rating >= 4.5 && (
          <Badge bg="warning" className="mb-2">
            <FontAwesomeIcon icon={faStar} className="me-1" />
            Top Rated
          </Badge>
        )}

        <h5 className="book-title">
          <FontAwesomeIcon icon={faBook} className="me-2" />
          {book.title}
        </h5>

        <p className="book-author">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          by {book.author}
        </p>

        <div className="rating-badge mb-2">
          <FontAwesomeIcon icon={faStar} className="me-1" />
          {generateStarRating(book.rating)} ({book.reviews})
        </div>

        {book.salesThisMonth > 0 && (
          <div className="sales-badge mb-2">
            <small className="text-muted">
              <FontAwesomeIcon icon={faChartLine} className="me-1" />
              {book.salesThisMonth} sold this month
            </small>
          </div>
        )}

        <div className="book-price mb-3">
          <FontAwesomeIcon icon={faTag} className="me-2" />
          {formatPrice(book.price)}
        </div>

        <div className="book-stock mb-3">
          <span
            className={`badge ${book.stock > 10 ? "bg-success" : book.stock > 0 ? "bg-warning" : "bg-danger"}`}
          >
            {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
          </span>
        </div>

        <div className="book-actions d-flex gap-1 mt-auto">
          <OverlayTrigger placement="top" overlay={wishlistTooltip}>
            <Button
              variant={isInWishlist(book.id) ? "danger" : "outline-danger"}
              size="sm"
              onClick={handleAddToWishlist}
              className="book-action-btn"
            >
              <FontAwesomeIcon
                icon={isInWishlist(book.id) ? faHeart : faHeartRegular}
                className="me-1"
              />
            </Button>
          </OverlayTrigger>

          {book.inStock ? (
            <>
              <OverlayTrigger placement="top" overlay={cartTooltip}>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleAddToCart}
                  className="book-action-btn"
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="me-1" />
                </Button>
              </OverlayTrigger>

              <OverlayTrigger placement="top" overlay={buyNowTooltip}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleBuyNow}
                  className="book-action-btn"
                >
                  <FontAwesomeIcon icon={faTruck} className="me-1" />
                </Button>
              </OverlayTrigger>
            </>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>This book is currently out of stock</Tooltip>}
            >
              <Button variant="outline-secondary" size="sm" disabled>
                <FontAwesomeIcon icon={faTimes} className="me-1" />
                <span className="btn-text">Out of Stock</span>
              </Button>
            </OverlayTrigger>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
