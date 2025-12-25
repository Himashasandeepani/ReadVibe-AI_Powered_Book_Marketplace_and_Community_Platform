import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { logout } from "../utils/auth";

// Import Components
import LoadingSpinner from "../components/UserProfile/LoadingSpinner";
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

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  
  // User data
  const [userStats, setUserStats] = useState({
    booksRead: 0,
    reviewsWritten: 0,
    wishlistCount: 0,
    communityPosts: 0,
    myBookRequests: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [orders, setOrders] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [bookRequests, setBookRequests] = useState([]);
  
  // Modal data
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    initializeUserData(currentUser);
  }, [navigate]);

  const initializeUserData = (currentUser) => {
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
    setLoading(false);
  };

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

    const newReview = submitReview(user, selectedBook, reviewData, selectedOrderId);
    
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
    // For now, just show a message
    showNotification("Edit feature coming soon!", "info");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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

  if (loading) {
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