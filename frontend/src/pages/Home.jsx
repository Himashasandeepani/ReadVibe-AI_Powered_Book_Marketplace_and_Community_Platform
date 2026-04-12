import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { getCurrentUser as getNormalizedCurrentUser } from "../utils/auth";
import { getBookReviewsForBook } from "../components/UserProfile/utils";
import GuestNotice from "../components/Home/GuestNotice";
import HeroSection from "../components/Home/HeroSection";
import FeaturesSection from "../components/Home/FeaturesSection";
import AISection from "../components/Home/AISection";
import PopularBooksSection from "../components/Home/PopularBooksSection";
import CommunitySection from "../components/Home/CommunitySection";
import StatsSection from "../components/Home/StatsSection";
import BookDetailsModal from "../components/Home/BookDetailsModal";
import { isPrivilegedUser } from "../utils/auth";
import "../styles/pages/Home.css";

const getStoredCurrentUser = () => {
  return getNormalizedCurrentUser();
};

const Home = () => {
  const [currentUser, setCurrentUser] = useState(() => getStoredCurrentUser());
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "currentUser") {
        setCurrentUser(getStoredCurrentUser());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isLoggedIn = () => {
    return currentUser !== null;
  };

  const mergeBookReviews = (book) => {
    if (!book) return book;

    const cachedReviews = getBookReviewsForBook(book.id);
    if (cachedReviews.length === 0) return book;

    const nextReviewsList = [
      ...(Array.isArray(book.reviewsList) ? book.reviewsList : []),
      ...cachedReviews,
    ].filter((review, index, allReviews) => {
      const key = `${review.id || review.userName || review.user || index}-${review.text || review.comment || ""}`;
      return allReviews.findIndex((item, reviewIndex) => {
        const itemKey = `${item.id || item.userName || item.user || reviewIndex}-${item.text || item.comment || ""}`;
        return itemKey === key;
      }) === index;
    });

    return {
      ...book,
      reviews: Math.max(Number(book.reviews) || 0, nextReviewsList.length),
      reviewsList: nextReviewsList,
    };
  };

  const handleViewDetails = (book) => {
    setSelectedBook(mergeBookReviews(book));
    setShowBookModal(true);
  };

  useEffect(() => {
    const handleBookReviewsUpdated = () => {
      setSelectedBook((current) => mergeBookReviews(current));
    };

    window.addEventListener("book-reviews-updated", handleBookReviewsUpdated);
    return () => window.removeEventListener("book-reviews-updated", handleBookReviewsUpdated);
  }, []);

  const handleCloseModal = () => {
    setShowBookModal(false);
  };

  return (
    <div className="home-page">
      <BookDetailsModal
        show={showBookModal}
        onHide={handleCloseModal}
        book={selectedBook}
        currentUser={currentUser}
        actionsDisabled={isPrivilegedUser()}
      />

      {!isLoggedIn() && <GuestNotice />}

      <HeroSection />

      <FeaturesSection />

      <Container>
        <AISection />
      </Container>

      <PopularBooksSection
        currentUser={currentUser}
        onViewDetails={handleViewDetails}
      />

      <CommunitySection currentUser={currentUser} />

      <StatsSection />
    </div>
  );
};

export default Home;
