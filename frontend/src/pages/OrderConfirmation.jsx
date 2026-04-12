import { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../utils/auth";
import { showNotification } from "../utils/helpers";
import { addItem } from "../store/slices/cartSlice";
import { getOrderApi, getOrdersApi } from "../utils/orderApi";
import createBookCoverPlaceholder from "../utils/imagePlaceholders";
import { getOrderPaymentConfirmationKey } from "../components/Checkout/utils";

// Import Components
import ProgressSteps from "../components/common/ProgressSteps";
import ConfirmationHeader from "../components/OrderConfirmation/ConfirmationHeader";
import OrderInfoSection from "../components/OrderConfirmation/OrderInfoSection";
import ShippingInfoSection from "../components/OrderConfirmation/ShippingInfoSection";
import OrderItemsSection from "../components/OrderConfirmation/OrderItemsSection";
import OrderActions from "../components/OrderConfirmation/OrderActions";
import OrderSummaryCard from "../components/OrderConfirmation/OrderSummaryCard";
import DeliveryTimeline from "../components/OrderConfirmation/DeliveryTimeline";
import SupportOptions from "../components/OrderConfirmation/SupportOptions";
import RecommendedBooks from "../components/OrderConfirmation/RecommendedBooks";
import TrackOrderModal from "../components/OrderConfirmation/TrackOrderModal";
import ContactSupportModal from "../components/OrderConfirmation/ContactSupportModal";
import LiveChatModal from "../components/OrderConfirmation/LiveChatModal";

// Import Utilities
import {
  getOrderedCategories,
  getRecommendedBooks,
  calculateEstimatedDates,
  downloadInvoice,
  addSupportRequest,
  getTrackingUpdates,
  shippingMethods,
} from "../components/OrderConfirmation/utils";

import "../styles/pages/OrderConfirmation.css";

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);

  // Sample books data
  const books = useMemo(
    () => [
      {
        id: 1,
        title: "The Midnight Library",
        author: "Matt Haig",
        price: 6000.0,
        category: "Fiction",
        rating: 4.3,
        reviews: 128,
        inStock: true,
        image: createBookCoverPlaceholder(),
      },
      {
        id: 2,
        title: "Project Hail Mary",
        author: "Andy Weir",
        price: 6500.0,
        category: "Science Fiction",
        rating: 4.8,
        reviews: 95,
        inStock: true,
        image: createBookCoverPlaceholder(),
      },
      {
        id: 3,
        title: "Dune",
        author: "Frank Herbert",
        price: 5400.0,
        category: "Science Fiction",
        rating: 4.0,
        reviews: 210,
        inStock: true,
        image: createBookCoverPlaceholder(),
      },
      {
        id: 4,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        price: 3500.0,
        category: "Fantasy",
        rating: 4.9,
        reviews: 305,
        inStock: false,
        image: createBookCoverPlaceholder(),
      },
    ],
    [],
  );

  const currentUser = useMemo(() => getCurrentUser(), []);
  const orderId = searchParams.get("orderId");

  const getStoredPaymentConfirmation = (targetOrderId) => {
    try {
      const key = getOrderPaymentConfirmationKey(targetOrderId);
      const stored = JSON.parse(
        localStorage.getItem(key) || sessionStorage.getItem(key) || "null",
      );

      if (!stored) return null;
      if (targetOrderId && String(stored.orderId) !== String(targetOrderId)) {
        return null;
      }

      return stored;
    } catch {
      return null;
    }
  };

  const buildOrderState = (fetchedOrder, fallbackOrderId) => {
    const paymentConfirmation =
      getStoredPaymentConfirmation(fetchedOrder?.id || fallbackOrderId) || {};

    return {
      id: fetchedOrder.id,
      orderNumber: fetchedOrder.orderNumber || fetchedOrder.id,
      orderDate:
        fetchedOrder.orderDate ||
        fetchedOrder.createdAt ||
        fetchedOrder.updatedAt ||
        paymentConfirmation.timestamp ||
        new Date().toISOString(),
      createdAt: fetchedOrder.createdAt,
      updatedAt: fetchedOrder.updatedAt,
      payment: {
        method:
          fetchedOrder.payment?.method ||
          fetchedOrder.paymentMethod ||
          paymentConfirmation.method ||
          "Credit Card",
        transactionId:
          fetchedOrder.payment?.transactionId ||
          fetchedOrder.transactionId ||
          paymentConfirmation.transactionId ||
          null,
      },
      items:
        fetchedOrder.items?.map((item) => ({
          id: item.bookId,
          title: item.title,
          quantity: item.quantity,
          price: item.unitPrice,
          image: item.image,
        })) || [],
      shipping: fetchedOrder.shippingAddress || {},
      trackingUpdates: fetchedOrder.trackingUpdates || [],
      totals: {
        subtotal: fetchedOrder.subtotal,
        shipping: fetchedOrder.shippingCost,
        tax: fetchedOrder.tax,
        total: fetchedOrder.total,
      },
    };
  };

  useEffect(() => {
    const loadOrder = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        if (orderId) {
          const fetched = await getOrderApi(currentUser.id, orderId);
          if (fetched) {
            setOrder(buildOrderState(fetched, orderId));
          }
        } else {
          const orders = await getOrdersApi(currentUser.id);
          const first = orders[0];
          if (first) {
            setOrder(buildOrderState(first, first.id));
          }
        }
      } catch (err) {
        console.error("Failed to load order", err);
        showNotification(err.message || "Failed to load order", "danger");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [currentUser, orderId]);

  useEffect(() => {
    if (order && searchParams.get("view") === "tracking") {
      setShowTrackModal(true);
    }
  }, [order, searchParams]);

  const trackingUpdates =
    order?.trackingUpdates?.length > 0
      ? order.trackingUpdates
      : getTrackingUpdates(order?.id);

  const recommendedBooks = useMemo(() => {
    if (!order) return [];
    const orderedCategories = getOrderedCategories(order, books);
    return getRecommendedBooks(orderedCategories, books, 4);
  }, [order, books]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Handle adding book to cart
  const handleAddToCart = (bookId, quantity = 1) => {
    const user = getCurrentUser();
    if (!user) {
      showNotification("Please login to add items to cart", "warning");
      navigate("/login");
      return;
    }

    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    dispatch(
      addItem({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        image: book.image,
        quantity,
        stock: book.stock,
      }),
    );

    showNotification("Book added to cart!", "success");
  };

  // Handle invoice download
  const handleDownloadInvoice = () => {
    const user = getCurrentUser();
    if (!user || !order) return;

    const success = downloadInvoice(order, user, trackingUpdates);
    if (success) {
      alert("Invoice downloaded successfully!");
    } else {
      alert("Failed to download invoice. Please try again.");
    }
  };

  // Handle support request
  const handleSupportRequest = (message) => {
    const user = getCurrentUser();
    if (!user || !order) return;

    addSupportRequest(order, user, message);
    alert("Your support request has been submitted. We will contact you soon.");
    setShowSupportModal(false);
  };

  if (loading) {
    return (
      <div className="order-confirmation-page">
        <Container className="mt-5">
          <div className="form-container text-center py-5">
            <FontAwesomeIcon icon={faBookOpen} size="3x" className="mb-3 text-muted" />
            <h4>Loading order...</h4>
          </div>
        </Container>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-confirmation-page">
        <Container className="mt-5">
          <div className="form-container">
            <div className="confirmation-empty text-center py-5">
              <FontAwesomeIcon
                icon={faBookOpen}
                size="3x"
                className="mb-3 text-muted"
              />
              <h4>No Order Found</h4>
              <p className="text-muted">
                We couldn't find your order confirmation.
              </p>
              <div className="mt-3">
                <Link to="/marketplace" className="btn btn-primary me-2">
                  <FontAwesomeIcon icon="store" className="me-2" />
                  Continue Shopping
                </Link>
                <Link to="/user-profile" className="btn btn-outline-primary">
                  View Order History
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const shippingMethod = order.shipping?.shippingMethod || "standard";
  const methodDetails = shippingMethods[shippingMethod];
  const { shipDate, deliveryDate, processingDays } =
    calculateEstimatedDates(shippingMethod);

  return (
    <div className="order-confirmation-page">
      {/* Confirmation Content */}
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="form-container">
              {/* Progress Steps */}
              <ProgressSteps currentStep={3} />

              {/* Confirmation Header */}
              <ConfirmationHeader
                methodDetails={methodDetails}
                onTrackOrder={() => setShowTrackModal(true)}
                onContinueShopping={() => navigate("/marketplace")}
              />

              <Row>
                <Col lg={8}>
                  {/* Order Details Card */}
                  <Card className="order-details-card mb-4">
                    <Card.Body>
                      <h5 className="mb-4">
                        <FontAwesomeIcon icon="book" className="me-2" />
                        Order Details
                      </h5>

                      <OrderInfoSection order={order} />

                      <ShippingInfoSection
                        order={order}
                        methodDetails={methodDetails}
                      />

                      <OrderItemsSection items={order.items} />
                    </Card.Body>
                  </Card>

                  {/* Order Actions */}
                  <OrderActions
                    onContinueShopping={() => navigate("/marketplace")}
                    onViewOrderHistory={() => navigate("/user-profile")}
                    onDownloadInvoice={handleDownloadInvoice}
                  />
                </Col>

                <Col lg={4}>
                  {/* Order Summary */}
                  <OrderSummaryCard
                    order={order}
                    methodDetails={methodDetails}
                  />

                  {/* Delivery Timeline */}
                  <DeliveryTimeline
                    shipDate={shipDate}
                    deliveryDate={deliveryDate}
                    processingDays={processingDays}
                  />

                  {/* Support Options */}
                  <SupportOptions
                    onViewOrderStatus={() => setShowTrackModal(true)}
                    onContactSupport={() => setShowSupportModal(true)}
                    onLiveChat={() => setShowLiveChat(true)}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Recommended Books */}
      <RecommendedBooks
        books={recommendedBooks}
        onAddToCart={handleAddToCart}
      />

      {/* Modals */}
      <TrackOrderModal
        show={showTrackModal}
        onHide={() => setShowTrackModal(false)}
        order={order}
        methodDetails={methodDetails}
        trackingUpdates={trackingUpdates}
        deliveryDate={deliveryDate}
        processingDays={processingDays}
      />

      <ContactSupportModal
        show={showSupportModal}
        onHide={() => setShowSupportModal(false)}
        order={order}
        onSubmit={handleSupportRequest}
      />

      <LiveChatModal
        show={showLiveChat}
        onHide={() => setShowLiveChat(false)}
      />
    </div>
  );
};

export default OrderConfirmation;
