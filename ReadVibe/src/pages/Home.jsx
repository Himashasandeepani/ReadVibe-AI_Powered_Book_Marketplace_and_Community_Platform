import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import GuestNotice from "../components/Home/GuestNotice";
import HeroSection from "../components/Home/HeroSection";
import FeaturesSection from "../components/Home/FeaturesSection";
import AISection from "../components/Home/AISection";
import PopularBooksSection from "../components/Home/PopularBooksSection";
import CommunitySection from "../components/Home/CommunitySection";
import StatsSection from "../components/Home/StatsSection";
import BookDetailsModal from "../components/Home/BookDetailsModal";
import "../styles/pages/Home.css";

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
  }, []);

  const isLoggedIn = () => {
    return currentUser !== null;
  };

  const handleViewDetails = (book) => {
    setSelectedBook(book);
    setShowBookModal(true);
  };

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