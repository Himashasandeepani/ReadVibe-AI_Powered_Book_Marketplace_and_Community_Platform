import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faShoppingCart,
  faUser,
  faHeart,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  Navbar,
  Nav,
  Container,
  Dropdown,
  Button,
  Badge,
} from "react-bootstrap";
import { getCurrentUser, logout } from "../utils/auth";

const Header = () => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for logged in user
    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Get cart count
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);

    // Get wishlist count
    updateWishlistCount(currentUser);

    // Listen for storage changes to update counts in real-time
    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCartCount = updatedCart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setCartCount(updatedCartCount);

      updateWishlistCount(currentUser);
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events for wishlist updates
    const handleWishlistUpdate = () => {
      updateWishlistCount(currentUser);
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
    };
  }, []);

  const updateWishlistCount = (currentUser) => {
    if (currentUser) {
      const wishlist =
        JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`)) || [];
      setWishlistCount(wishlist.length);
    } else {
      setWishlistCount(0);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setWishlistCount(0);
    setExpanded(false);
    navigate("/");
  };

  const handleNavLinkClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      onToggle={(expanded) => setExpanded(expanded)}
      className="navbar sticky-top shadow-sm"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="navbar-brand fw-bold"
          onClick={handleNavLinkClick}
        >
          <FontAwesomeIcon icon={faBookOpen} className="me-2" />
          ReadVibe
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarNav" />

        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              className="fw-medium"
              onClick={handleNavLinkClick}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/marketplace"
              className="fw-medium"
              onClick={handleNavLinkClick}
            >
              Browse
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/community"
              className="fw-medium"
              onClick={handleNavLinkClick}
            >
              Community
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-3">
            {/* Cart Button */}
            <Button
              as={Link}
              to="/cart"
              variant="outline-primary"
              className="cart-btn position-relative"
              // title="Shopping Cart"
              onClick={handleNavLinkClick}
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              {cartCount > 0 && (
                <span className="badge rounded-pill">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Button>

            {/* User Menu or Login/Signup */}
            {user ? (
              <Dropdown
                className="dropdown-container"
                align="end"
                onToggle={(isOpen) => {
                  // Prevent navbar from closing when dropdown opens on mobile
                  if (isOpen && window.innerWidth < 992) {
                    setExpanded(true);
                  }
                }}
              >
                <Dropdown.Toggle
                  variant="primary"
                  id="user-dropdown"
                  className="dropdown-toggle-btn"
                >
                  <FontAwesomeIcon icon={faUser} className="me-1" />
                  {user.name.split(" ")[0]}
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="ms-2"
                    style={{ fontSize: "0.8rem" }}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu className="custom-dropdown-menu">
                  <Dropdown.Header>
                    <div className="text-muted small">Welcome back,</div>
                    <strong>{user.name}</strong>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    as={Link}
                    to="/user-profile"
                    className="dropdown-item"
                    onClick={() => setExpanded(false)}
                  >
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    My Profile
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/wishlist"
                    className="dropdown-item"
                    onClick={() => setExpanded(false)}
                  >
                    <FontAwesomeIcon icon={faHeart} className="me-2" />
                    Wishlist
                    {wishlistCount > 0 && (
                      <Badge bg="danger" className="ms-auto">
                        {wishlistCount}
                      </Badge>
                    )}
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="dropdown-item text-danger"
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login?login=true"
                  variant="outline-primary"
                  className="login-btn me-2"
                  onClick={handleNavLinkClick}
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/login?signup=true"
                  variant="primary"
                  className="signup-btn"
                  onClick={handleNavLinkClick}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
