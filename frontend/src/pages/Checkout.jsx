import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import { showNotification } from "../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

// Import Components
import LoadingSpinner from "../components/Checkout/LoadingSpinner";
import ProgressSteps from "../components/Checkout/ProgressSteps";
import PaymentForm from "../components/Checkout/PaymentForm";
import OrderSummary from "../components/Checkout/OrderSummary";
import CheckoutButtons from "../components/Checkout/CheckoutButtons";

// Import Utilities
import {
  validatePaymentForm,
  processPayment,
  createOrder,
  saveOrderToStorage,
  clearCheckoutData,
} from "../components/Checkout/utils";

import "../styles/pages/Checkout.css";

// Sample books data referenced when building order summaries
const SAMPLE_BOOKS = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 6000.0,
    category: "Fiction",
    image: "https://via.placeholder.com/60x80/DBEAFE/1E3A5F?text=Book",
  },
  {
    id: 2,
    title: "Project Hail Mary",
    author: "Andy Weir",
    price: 6500.0,
    category: "Science Fiction",
    image: "https://via.placeholder.com/60x80/DBEAFE/1E3A5F?text=Book",
  },
];

const safeParseJSON = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const buildOrderData = () => {
  const deliveryData = safeParseJSON(sessionStorage.getItem("deliveryData"));
  const cart = safeParseJSON(localStorage.getItem("cart")) || [];

  if (!deliveryData || cart.length === 0) {
    return null;
  }

  const subtotal = cart.reduce((sum, item) => {
    const book = SAMPLE_BOOKS.find((b) => b.id === item.id);
    return sum + (book?.price || 0) * item.quantity;
  }, 0);

  const shippingMethod = deliveryData.shipping?.shippingMethod;
  const shipping = shippingMethod === "standard"
    ? 500.0
    : shippingMethod === "express"
    ? 1200.0
    : 2500.0;

  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  return {
    items: cart.map((item) => {
      const book = SAMPLE_BOOKS.find((b) => b.id === item.id);
      return {
        ...item,
        title: book?.title || "Unknown Book",
        author: book?.author || "Unknown Author",
        price: book?.price || 0,
        image:
          book?.image ||
          "https://via.placeholder.com/60x80/DBEAFE/1E3A5F?text=Book",
      };
    }),
    shipping: deliveryData.shipping || {},
    totals: {
      subtotal,
      shipping,
      tax,
      total,
    },
  };
};

const Checkout = () => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expDate: "",
    cvv: "",
    cardholderName: "",
    sameAsShipping: true,
  });
  const [orderData, setOrderData] = useState(() => buildOrderData());
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      return;
    }

    showNotification("Please login to complete checkout", "warning");
    navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (!user || orderData) {
      return;
    }

    showNotification(
      "No order data found. Please start checkout from cart.",
      "warning"
    );

    const timeoutId = setTimeout(() => {
      navigate("/cart");
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [orderData, user, navigate]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "currentUser") {
        setUser(getCurrentUser());
      }

      if (event.key === "cart" || event.key === "deliveryData") {
        setOrderData(buildOrderData());
      }
    };

    const handleCartUpdated = () => {
      setOrderData(buildOrderData());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cart-updated", handleCartUpdated);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "currentUser") {
        setUser(getCurrentUser());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCardNumberChange = (e) => {
    handleInputChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validatePaymentForm(paymentData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotification("Please fix the errors in the form", "danger");
      return;
    }

    setFormErrors({});
    setIsLoading(true);

    try {
      // Process payment
      const paymentResult = await processPayment();

      // Create order
      const order = createOrder(user, orderData, paymentResult);

      // Save order
      saveOrderToStorage(order);

      // Clear checkout data
      clearCheckoutData();

      // Show success notification
      showNotification("Payment successful! Order placed.", "success");

      // Redirect to confirmation page
      setTimeout(() => {
        navigate(`/order-confirmation?orderId=${order.id}`);
      }, 1500);
    } catch (error) {
      console.error("Checkout error:", error);
      showNotification(
        error.message || "Payment failed. Please try again.",
        "danger"
      );
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/delivery-details");
  };

  if (!orderData || !orderData.items.length) {
    return <LoadingSpinner message="Loading checkout data..." />;
  }

  return (
    <div className="checkout-page">
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col lg={12}>
            <Card className="form-container">
              <Card.Body>
                <h2 className="mb-4">
                  <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                  Checkout
                </h2>

                <ProgressSteps currentStep={2} />

                {formErrors.general && (
                  <Alert variant="danger" className="mt-3">
                    {formErrors.general}
                  </Alert>
                )}

                <Row>
                  <Col lg={8}>
                    <PaymentForm
                      paymentData={paymentData}
                      formErrors={formErrors}
                      isLoading={isLoading}
                      onSubmit={handleSubmit}
                      handleCardNumberChange={handleCardNumberChange}
                      handleInputChange={handleInputChange}
                    />
                    
                    <CheckoutButtons
                      onBack={handleBack}
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                    />
                  </Col>

                  <Col lg={4}>
                    <OrderSummary orderData={orderData} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="checkout-loading">
          <div className="checkout-loading-spinner"></div>
          <div className="checkout-loading-text">Processing Payment...</div>
        </div>
      )}
    </div>
  );
};

export default Checkout;