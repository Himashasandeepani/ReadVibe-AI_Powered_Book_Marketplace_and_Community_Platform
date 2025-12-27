import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Badge } from "react-bootstrap";
import BookCard from "../Home/BookCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faBookmark, faCogs } from "@fortawesome/free-solid-svg-icons";

const PopularBooksSection = ({ currentUser, onViewDetails }) => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const navigate = useNavigate();

  const getBookImage = (bookTitle) => {
    const imageMap = {
      "The Midnight Library": "/assets/The_Midnight_Library.jpeg",
      "Project Hail Mary": "/assets/project_hail_mary.jpg",
      "Dune": "/assets/dune.jpg",
      "The Hobbit": "/assets/the_hobbit.jpg",
      "The Silent Patient": "/assets/silent_patient.jpg",
      "Where the Crawdads Sing": "/assets/crawdads_sing.jpg",
      "Atomic Habits": "/assets/atomic_habits.jpg",
      "The Alchemist": "/assets/alchemist.jpg",
    };
    
    return imageMap[bookTitle] || "/assets/default_book.jpg";
  };

  useEffect(() => {
    const loadFeaturedBooks = () => {
      try {
        const storedBooks = JSON.parse(localStorage.getItem("stockBooks")) || [];
        
        let featured = storedBooks.filter(book => book.featured === true);
        
        if (featured.length < 4) {
          featured = [...storedBooks]
            .sort((a, b) => b.salesThisMonth - a.salesThisMonth)
            .slice(0, 4);
        }
        
        const formattedBooks = featured.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          category: book.category,
          price: book.price,
          image: getBookImage(book.title),
          rating: Math.min(5, 4 + (book.salesThisMonth / 20)),
          reviews: book.totalSales || Math.floor(Math.random() * 50) + 10,
          inStock: book.stock > 0,
          stock: book.stock,
          salesThisMonth: book.salesThisMonth,
          publisher: book.publisher,
          publishedDate: book.publicationYear?.toString(),
          isbn: book.isbn,
          language: book.language,
          pages: book.pages,
        }));
        
        setFeaturedBooks(formattedBooks);
      } catch (error) {
        console.error("Error loading featured books:", error);
      }
    };

    loadFeaturedBooks();

    const handleStorageUpdate = () => {
      loadFeaturedBooks();
    };

    window.addEventListener("storage", handleStorageUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title mb-0">
          <FontAwesomeIcon icon={faFire} className="me-2" />
          Popular This Week
          <div className="section-title-decoration"></div>
        </h2>
        {featuredBooks.some(book => book.featured) && (
          <Badge bg="warning" className="fs-6">
            <FontAwesomeIcon icon={faFire} className="me-1" />
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
                currentUser={currentUser}
                onViewDetails={() => onViewDetails(book)}
              />
            </Col>
          ))
        ) : (
          <Col xs={12} className="text-center py-5">
            <FontAwesomeIcon icon={faBookmark} className="fa-4x text-muted mb-3" />
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
        {currentUser?.role === "stock-manager" || currentUser?.role === "admin" || currentUser?.role === "stock" ? (
          <Link to="/stock-manager?tab=popular-books" className="btn btn-outline-primary">
            <FontAwesomeIcon icon={faCogs} className="me-2" />
            Manage Popular Books
          </Link>
        ) : null}
      </div>
    </Container>
  );
};

export default PopularBooksSection;