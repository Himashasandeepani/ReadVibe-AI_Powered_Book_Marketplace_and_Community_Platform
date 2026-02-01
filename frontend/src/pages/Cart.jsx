import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  removeItem,
  updateQuantity,
  clearCart,
  syncFromStorage,
} from "../store/slices/cartSlice";

// Import Components
import CartHeader from "../components/Cart/CartHeader";
import EmptyCart from "../components/Cart/EmptyCart";
import CartItemsList from "../components/Cart/CartItemsList";
import OrderSummary from "../components/Cart/OrderSummary";

// Import Utilities
import {
  calculateTotals,
  checkStockAvailability,
  prepareCheckoutData,
} from "../components/Cart/cartUtils";

import { getCurrentUser } from "../utils/auth";
import { showNotification, books } from "../utils/helpers";
import "../styles/pages/Cart.css";

const Cart = () => {
  const cart = useSelector(selectCartItems);
  const [user, setUser] = useState(() => getCurrentUser());
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      showNotification("Please log in to view your cart.", "warning");
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "currentUser") {
        setUser(getCurrentUser());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    dispatch(syncFromStorage());

    const syncCartState = () => dispatch(syncFromStorage());

    const handleStorageCartChange = (event) => {
      if (event.key === "cart") {
        syncCartState();
      }
    };

    window.addEventListener("cart-updated", syncCartState);
    window.addEventListener("storage", handleStorageCartChange);

    return () => {
      window.removeEventListener("cart-updated", syncCartState);
      window.removeEventListener("storage", handleStorageCartChange);
    };
  }, [dispatch]);

  const handleRemoveFromCart = (bookId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this item from your cart?"
      )
    ) {
      dispatch(removeItem(bookId));
      showNotification("Item removed from cart", "info");
    }
  };

  const handleUpdateQuantity = (bookId, change) => {
    dispatch(updateQuantity({ id: bookId, delta: change }));
    if (change > 0) {
      showNotification("Quantity increased", "success");
    } else if (change < 0) {
      showNotification("Quantity decreased", "info");
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      dispatch(clearCart());
      showNotification("Cart cleared", "info");
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showNotification("Your cart is empty", "warning");
      return;
    }

    // Check if all items are in stock
    const outOfStockItems = checkStockAvailability(cart, books);

    if (outOfStockItems.length > 0) {
      showNotification(
        "Some items in your cart are out of stock. Please remove them to proceed.",
        "danger"
      );
      return;
    }

    // Prepare checkout data
    const checkoutData = prepareCheckoutData(cart, books);

    // Save cart and totals to session for checkout
    sessionStorage.setItem("checkoutCart", JSON.stringify(cart));
    sessionStorage.setItem("orderSummary", JSON.stringify(checkoutData.totals));
    sessionStorage.setItem("cartItems", JSON.stringify(checkoutData.cartItems));

    // Redirect to delivery details
    navigate("/delivery-details");
  };

  const handleShopping = () => {
    navigate("/marketplace");
  };

  const totals = calculateTotals(cart, books);

  return (
    <div className="cart-page">
      <Container className="mt-4">
        <CartHeader cart={cart} onClearCart={handleClearCart} />

        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div id="cartItems">
            <Row>
              <Col lg={8}>
                <CartItemsList
                  cart={cart}
                  books={books}
                  onRemoveItem={handleRemoveFromCart}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              </Col>
              <Col lg={4}>
                <OrderSummary
                  totals={totals}
                  cart={cart}
                  onCheckout={handleCheckout}
                  onContinueShopping={handleShopping}
                />
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Cart;