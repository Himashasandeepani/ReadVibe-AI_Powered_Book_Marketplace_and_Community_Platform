import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

// Import Components
import LoadingSpinner from "../components/common/LoadingSpinner";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import ReadingStatsCard from "../components/UserProfile/ReadingStatsCard";
import DashboardOverview from "../components/UserProfile/DashboardOverview";
import RecentActivity from "../components/UserProfile/RecentActivity";
import QuickActions from "../components/UserProfile/QuickActions";
import OrderHistory from "../components/UserProfile/OrderHistory";
import MyReviews from "../components/UserProfile/MyReviews";
import BookRequests from "../components/UserProfile/BookRequests";
import EditProfileModal from "../components/UserProfile/EditProfileModal";
import RequestBookModal from "../components/UserProfile/RequestBookModal";
import AddReviewModal from "../components/UserProfile/AddReviewModal";

// Import Utilities
import {
  getCurrentUser,
  loadUserData,
  updateUserProfile,
  submitBookRequest,
  submitReview,
  deleteReview,
  findUnreviewedItems,
  books,
  showNotification,
} from "../components/UserProfile/utils";

import "../styles/pages/UserProfile.css";

const EMPTY_USER_STATS = {
  booksRead: 0,
  reviewsWritten: 0,
  wishlistCount: 0,
  communityPosts: 0,
  myBookRequests: 0,
};

const EMPTY_USER_DATA = {
  orders: [],
  reviews: [],
  bookRequests: [],
  userStats: EMPTY_USER_STATS,
  recentActivity: [],
};

const UserProfile = () => {
  const seededUser = typeof window === "undefined" ? null : getCurrentUser();
  const initialData = seededUser ? loadUserData(seededUser) : EMPTY_USER_DATA;

  const [user, setUser] = useState(seededUser);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  
  // User data
  const [userStats, setUserStats] = useState({ ...initialData.userStats });
  const [recentActivity, setRecentActivity] = useState([...initialData.recentActivity]);
  const [orders, setOrders] = useState([...initialData.orders]);
  const [myReviews, setMyReviews] = useState([...initialData.reviews]);
  const [bookRequests, setBookRequests] = useState([...initialData.bookRequests]);
  
  // Modal data
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const navigate = useNavigate();

  const initializeUserData = (currentUser) => {
    if (!currentUser) return;

    const {
      orders: userOrders,
      reviews: userReviews,
      bookRequests: userRequests,
      userStats: stats,
      recentActivity: activity,
    } = loadUserData(currentUser);

    setOrders(userOrders);
    setMyReviews(userReviews);
    setBookRequests(userRequests);
    setUserStats(stats);
    setRecentActivity(activity);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const handleUpdateProfile = (updatedData) => {
    const updatedUser = updateUserProfile(user, updatedData);
    setUser(updatedUser);
    setShowEditModal(false);
    showNotification("Profile updated successfully!", "success");
  };

  const handleSubmitBookRequest = (requestData) => {
    const newRequest = submitBookRequest(user, requestData);
    setBookRequests([...bookRequests, newRequest]);
    setUserStats((prev) => ({
      ...prev,
      myBookRequests: prev.myBookRequests + 1,
    }));
    setShowRequestModal(false);
    showNotification("Book request submitted successfully!", "success");
  };

  const handleReviewOrderItems = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const unreviewedItems = findUnreviewedItems(order, myReviews);

    if (unreviewedItems.length === 0) {
      showNotification("All items in this order have been reviewed", "info");
      return;
    }

    // For simplicity, review first unreviewed item
    const bookToReview = books.find((b) => b.id.toString() === unreviewedItems[0].id.toString());
    if (bookToReview) {
      setSelectedBook(bookToReview);
      setSelectedOrderId(orderId);
      setShowReviewModal(true);
    }
  };

  const handleSubmitReview = (reviewData) => {
    if (reviewData.rating === 0) {
      showNotification("Please select a rating", "warning");
      return;
    }

    if (!reviewData.text.trim()) {
      showNotification("Please write your review", "warning");
      return;
    }
    if (!selectedBook) {
      showNotification("Please select a book to review", "warning");
      return;
    }

    // Ensure the review payload includes the book id required by submitReview
    const reviewPayload = { ...reviewData, bookId: selectedBook.id };

    const newReview = submitReview(user, selectedBook, reviewPayload, selectedOrderId);
    
    setMyReviews([...myReviews, newReview]);
    setUserStats((prev) => ({
      ...prev,
      reviewsWritten: prev.reviewsWritten + 1,
    }));
    setShowReviewModal(false);
    setSelectedBook(null);
    setSelectedOrderId(null);
    
    showNotification("Review submitted successfully!", "success");
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteReview(reviewId, user.id);
      
      const updatedReviews = myReviews.filter((review) => review.id !== reviewId);
      setMyReviews(updatedReviews);
      setUserStats((prev) => ({
        ...prev,
        reviewsWritten: prev.reviewsWritten - 1,
      }));
      
      showNotification("Review deleted successfully!", "success");
    }
  };

  const handleViewOrderDetails = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Navigate to order confirmation page with orderId
    navigate(`/order-confirmation?orderId=${orderId}`);
  };

  const handleEditReview = (review) => {
    const itemLabel = review?.bookTitle || review?.title || "this review";
    showNotification(`Edit feature for ${itemLabel} coming soon!`, "info");
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            <DashboardOverview 
              userStats={userStats} 
              onNavigate={(destination) => {
                if (destination.startsWith("/")) {
                  navigate(destination);
                } else {
                  setActiveSection(destination);
                }
              }}
            />
            <RecentActivity 
              activities={recentActivity} 
              onRefresh={() => initializeUserData(user)}
            />
            <QuickActions
              onViewOrders={() => setActiveSection("orders")}
              onViewReviews={() => setActiveSection("reviews")}
              onRequestBook={() => setShowRequestModal(true)}
            />
          </>
        );

      case "orders":
        return (
          <OrderHistory
            orders={orders}
            onBack={() => setActiveSection("overview")}
            onReviewOrder={handleReviewOrderItems}
            onViewDetails={handleViewOrderDetails}
          />
        );

      case "reviews":
        return (
          <MyReviews
            reviews={myReviews}
            onBack={() => setActiveSection("overview")}
            onEditReview={handleEditReview}
            onDeleteReview={handleDeleteReview}
          />
        );

      case "requests":
        return (
          <BookRequests
            requests={bookRequests}
            onBack={() => setActiveSection("overview")}
            onNewRequest={() => setShowRequestModal(true)}
          />
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="user-profile-page">
        <LoadingSpinner message="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      {/* User Profile Content */}
      <Container className="mt-4">
        <h2 className="mb-4">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          My Profile
        </h2>

        <Row>
          <Col lg={4}>
            <UserInfoCard
              user={user}
              activeSection={activeSection}
              onEditProfile={() => setShowEditModal(true)}
              onChangeSection={setActiveSection}
            />
            <ReadingStatsCard userStats={userStats} />
          </Col>

          <Col lg={8}>{renderSectionContent()}</Col>
        </Row>
      </Container>

      {/* Modals */}
      <EditProfileModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        user={user}
        onSave={handleUpdateProfile}
      />

      <RequestBookModal
        show={showRequestModal}
        onHide={() => setShowRequestModal(false)}
        onSubmit={handleSubmitBookRequest}
      />

      <AddReviewModal
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        book={selectedBook}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default UserProfile;