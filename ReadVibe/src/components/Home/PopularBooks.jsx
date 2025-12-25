import React from "react";
import { Row, Col, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faStar, faBookmark, faCogs, faBook } from "@fortawesome/free-solid-svg-icons";
import BookCard from "./BookCard";

const PopularBooks = ({ 
  featuredBooks, 
  stockBooks, 
  currentUser, 
  onViewDetails, 
  onAddToWishlist, 
  onAddToCart, 
  onBuyNow,
  isLoggedIn,
  isInWishlist,
  navigate 
}) => {
  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title mb-0">
          <FontAwesomeIcon icon={faFire} className="me-2" />
          Popular This Week
          <div className="section-title-decoration"></div>
        </h2>
        {stockBooks.some(book => book.featured) && (
          <Badge bg="warning" className="fs-6">
            <FontAwesomeIcon icon={faStar} className="me-1" />
            Featured from Inventory
          </Badge>
        )}
      </div>

      <Row id="featuredBooks">
        {featuredBooks.length > 0 ? (
          featuredBooks.map((book) => (
            <Col md={3} key={book.id} className="mb-4">
              <BookCard
                book={book}
                onViewDetails={onViewDetails}
                onAddToWishlist={onAddToWishlist}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                isLoggedIn={isLoggedIn}
                isInWishlist={isInWishlist}
                navigate={navigate}
              />
            </Col>
          ))
        ) : (
          <Col xs={12} className="text-center py-5">
            <FontAwesomeIcon icon={faBook} className="fa-4x text-muted mb-3" />
            <h5>No popular books available</h5>
            <p className="text-muted">Check back later for featured books</p>
          </Col>
        )}
      </Row>

      <div className="text-center mt-4">
        <Link to="/marketplace" className="btn btn-primary me-3">
          <FontAwesomeIcon icon={faBookmark} className="me-2" />
          View All Books
        </Link>
        {currentUser?.role === "stock-manager" || currentUser?.role === "admin" ? (
          <Link to="/stock-manager?tab=popular-books" className="btn btn-outline-primary">
            <FontAwesomeIcon icon={faCogs} className="me-2" />
            Manage Popular Books
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default PopularBooks;