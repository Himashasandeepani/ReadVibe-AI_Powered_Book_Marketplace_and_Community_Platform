// import React from "react";
// import { Modal, Button, Row, Col, Badge } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faBook,
//   faUser,
//   faStar,
//   faTimes,
//   faHeart,
//     faShoppingCart,
//   faTruck,
//   faBookmark,
//   faBookOpen,
//   faInfoCircle,
//   faPrint,
//   faCalendar,
//   faBarcode,
//   faLanguage,
//   faComments
// } from "@fortawesome/free-solid-svg-icons";
// import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
// import { formatPrice, generateStarRating } from "../../utils/helpers";

// const BookDetailsModal = ({
//   show,
//   onHide,
//   book,
//   isLoggedIn,
//   isInWishlist,
//   onAddToWishlist,
//   onAddToCart,
//   onBuyNow,
//   navigate
// }) => {
//   if (!book) return null;

//   return (
//     <Modal
//       show={show}
//       onHide={onHide}
//       size="lg"
//       animation={true}
//       centered
//     >
//       <Modal.Header closeButton>
//         <Modal.Title>
//           <FontAwesomeIcon icon={faBook} className="me-2" />
//           {book.title}
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Row>
//           <Col md={4}>
//             <div className="text-center">
//               <img
//                 src={book.image}
//                 alt={book.title}
//                 className="img-fluid rounded mb-3"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = "/assets/The_Midnight_Library.jpeg";
//                 }}
//               />
//             </div>
//           </Col>

//           <Col md={8}>
//             <h4>
//               <FontAwesomeIcon icon={faUser} className="me-2" />
//               by {book.author}
//             </h4>

//             <div className="d-flex align-items-center mb-3">
//               <div className="rating-badge">
//                 <FontAwesomeIcon icon={faStar} className="me-1" />
//                 {generateStarRating(book.rating)} ({book.reviews} reviews)
//               </div>
//               <span className="ms-3 fs-5 fw-bold">
//                 {formatPrice(book.price)}
//               </span>
//             </div>

//             <div className="mb-3">
//               <Badge bg="primary" className="me-2">
//                 <FontAwesomeIcon icon={faBookmark} className="me-1" />
//                 {book.genre || book.category}
//               </Badge>
//               <Badge bg="secondary">
//                 <FontAwesomeIcon icon={faBookOpen} className="me-1" />
//                 {book.pages || "N/A"} pages
//               </Badge>
//             </div>

//             <p className="mb-4">{book.description}</p>

//             <div className="mb-4">
//               <h5>
//                 <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
//                 Details
//               </h5>
//               <ul className="list-unstyled">
//                 <li>
//                   <strong>
//                     <FontAwesomeIcon icon={faPrint} className="me-2" />
//                     Publisher:
//                   </strong>{" "}
//                   {book.publisher || "Not specified"}
//                 </li>
//                 <li>
//                   <strong>
//                     <FontAwesomeIcon icon={faCalendar} className="me-2" />
//                     Published:
//                   </strong>{" "}
//                   {book.publishedDate || "Not specified"}
//                 </li>
//                 <li>
//                   <strong>
//                     <FontAwesomeIcon icon={faBarcode} className="me-2" />
//                     ISBN:
//                   </strong>{" "}
//                   {book.isbn || "Not specified"}
//                 </li>
//                 <li>
//                   <strong>
//                     <FontAwesomeIcon icon={faLanguage} className="me-2" />
//                     Language:
//                   </strong>{" "}
//                   {book.language || "English"}
//                 </li>
//               </ul>
//             </div>

//             <div>
//               <h5>
//                 <FontAwesomeIcon icon={faComments} className="me-2" />
//                 Customer Reviews
//               </h5>
//               {book.reviewHighlights && book.reviewHighlights.length > 0 ? (
//                 book.reviewHighlights.map((review, index) => (
//                   <div key={index} className="mb-3 p-3 border rounded">
//                     <div className="d-flex align-items-center mb-2">
//                       <span className="fw-bold me-2">
//                         <FontAwesomeIcon icon={faUser} className="me-1" />
//                         {review.user}
//                       </span>
//                       <span className="text-warning">
//                         {generateStarRating(review.rating)}
//                       </span>
//                     </div>
//                     <p className="mb-0">{review.comment}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p>No reviews yet. Be the first to review this book!</p>
//               )}
//             </div>
//           </Col>
//         </Row>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide}>
//           <FontAwesomeIcon icon={faTimes} className="me-2" />
//           Close
//         </Button>

//         {isLoggedIn ? (
//           <>
//             <Button
//               variant={isInWishlist(book.id) ? "danger" : "outline-danger"}
//               onClick={() => onAddToWishlist(book.id)}
//               className="book-action-btn"
//             >
//               <FontAwesomeIcon
//                 icon={isInWishlist(book.id) ? faHeart : faHeartRegular}
//                 className="me-2"
//               />
//               {isInWishlist(book.id)
//                 ? "Remove from Wishlist"
//                 : "Add to Wishlist"}
//             </Button>
//             <Button
//               variant="outline-primary"
//               onClick={() => onAddToCart(book.id)}
//               className="book-action-btn"
//             >
//               <FontAwesomeIcon icon={  faShoppingCart} className="me-2" />
//               Add to Cart
//             </Button>
//             <Button
//               variant="primary"
//               onClick={() => {
//                 onBuyNow(book.id);
//                 onHide();
//               }}
//               className="book-action-btn"
//             >
//               <FontAwesomeIcon icon={faTruck} className="me-2" />
//               Buy Now
//             </Button>
//           </>
//         ) : (
//           <>
//             <Button
//               variant="outline-danger"
//               onClick={() => {
//                 onHide();
//                 navigate("/login");
//               }}
//               className="book-action-btn"
//             >
//               <FontAwesomeIcon icon={faHeartRegular} className="me-2" />
//               Login for Wishlist
//             </Button>
//             <Button
//               variant="outline-primary"
//               onClick={() => {
//                 onHide();
//                 navigate("/login");
//               }}
//               className="book-action-btn"
//             >
//               <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
//               Login to Add to Cart
//             </Button>
//             <Button
//               variant="primary"
//               onClick={() => {
//                 onHide();
//                 navigate("/login");
//               }}
//               className="book-action-btn"
//             >
//               <FontAwesomeIcon icon={faTruck} className="me-2" />
//               Login to Buy
//             </Button>
//           </>
//         )}
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default BookDetailsModal;










import React from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faUser,
  faStar,
  faHeart,
  faShoppingCart,
  faTruck,
  faTimes,
  faBookmark,
  faBookOpen,
  faComments,
  faPrint,
  faCalendar,
  faBarcode,
  faLanguage,
  faChartLine,
  faStore,
  faFire
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { formatPrice, generateStarRating, getStockBadge } from "./utils";

const BookDetailsModal = ({ 
  show, 
  onHide, 
  selectedBook, 
  isLoggedIn, 
  isInWishlist, 
  onAddToWishlist, 
  onAddToCart, 
  onBuyNow 
}) => {
  const navigate = useNavigate();
  
  if (!selectedBook) return null;

  const stockBadge = getStockBadge(selectedBook);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      animation={true}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faBook} className="me-2" />
          {selectedBook.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-4">
            <div className="text-center">
              <img
                src={selectedBook.image}
                alt={selectedBook.title}
                className="img-fluid rounded mb-3"
                style={{ maxHeight: "300px" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/assets/default_book.jpg";
                }}
              />
              <div className="mb-3">
                <Badge bg={stockBadge.variant}>{stockBadge.text}</Badge>
                {selectedBook.salesThisMonth > 0 && (
                  <Badge bg="info" className="ms-2">
                    <FontAwesomeIcon icon={faFire} className="me-1" />
                    {selectedBook.salesThisMonth} sold this month
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <h4>
              <FontAwesomeIcon icon={faUser} className="me-2" />
              by {selectedBook.author}
            </h4>

            <div className="d-flex align-items-center mb-3">
              <div className="rating-badge">
                <FontAwesomeIcon icon={faStar} className="me-1" />
                {generateStarRating(selectedBook.rating)} (
                {selectedBook.reviews} reviews)
              </div>
              <span className="ms-3 fs-5 fw-bold">
                {formatPrice(selectedBook.price)}
              </span>
            </div>

            <div className="mb-3">
              <span className="badge bg-primary me-2">
                <FontAwesomeIcon icon={faBookmark} className="me-1" />
                {selectedBook.category}
              </span>
              <span className="badge bg-secondary me-2">
                <FontAwesomeIcon icon={faBookOpen} className="me-1" />
                {selectedBook.pages || "N/A"} pages
              </span>
              {selectedBook.stock > 0 && (
                <span className="badge bg-success">
                  <FontAwesomeIcon icon={faStore} className="me-1" />
                  {selectedBook.stock} in stock
                </span>
              )}
            </div>

            <p className="mb-4">
              {selectedBook.description || "No description available."}
            </p>

            <div className="mb-4">
              <h5>
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Details
              </h5>
              <ul className="list-unstyled">
                <li>
                  <strong>
                    <FontAwesomeIcon icon={faPrint} className="me-2" />
                    Publisher:
                  </strong>{" "}
                  {selectedBook.publisher || "Not specified"}
                </li>
                <li>
                  <strong>
                    <FontAwesomeIcon icon={faCalendar} className="me-2" />
                    Published:
                  </strong>{" "}
                  {selectedBook.publishedDate || "Not specified"}
                </li>
                <li>
                  <strong>
                    <FontAwesomeIcon icon={faBarcode} className="me-2" />
                    ISBN:
                  </strong>{" "}
                  {selectedBook.isbn || "Not specified"}
                </li>
                <li>
                  <strong>
                    <FontAwesomeIcon icon={faLanguage} className="me-2" />
                    Language:
                  </strong>{" "}
                  {selectedBook.language || "English"}
                </li>
                {selectedBook.salesThisMonth > 0 && (
                  <li>
                    <strong>
                      <FontAwesomeIcon icon={faChartLine} className="me-2" />
                      Monthly Sales:
                    </strong>{" "}
                    {selectedBook.salesThisMonth} copies
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h5>
                <FontAwesomeIcon icon={faComments} className="me-2" />
                Customer Reviews
              </h5>
              {selectedBook.reviewHighlights && selectedBook.reviewHighlights.length > 0 ? (
                selectedBook.reviewHighlights.map((review, index) => (
                  <div key={index} className="mb-3 p-3 border rounded">
                    <div className="d-flex align-items-center mb-2">
                      <span className="fw-bold me-2">
                        <FontAwesomeIcon icon={faUser} className="me-1" />
                        {review.user}
                      </span>
                      <span className="text-warning">
                        {generateStarRating(review.rating)}
                      </span>
                    </div>
                    <p className="mb-0">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet. Be the first to review this book!</p>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <FontAwesomeIcon icon={faTimes} className="me-2" />
          Close
        </Button>

        {isLoggedIn ? (
          <>
            <Button
              variant={isInWishlist(selectedBook.id) ? "danger" : "outline-danger"}
              onClick={(e) => onAddToWishlist(selectedBook.id, e)}
              className="book-action-btn"
            >
              <FontAwesomeIcon
                icon={isInWishlist(selectedBook.id) ? faHeart : faHeartRegular}
                className="me-2"
              />
              {isInWishlist(selectedBook.id)
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </Button>
            <Button
              variant="outline-primary"
              onClick={(e) => onAddToCart(selectedBook.id, e)}
              className="book-action-btn"
              disabled={!selectedBook.inStock || selectedBook.stock === 0}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              Add to Cart
            </Button>
            <Button
              variant="primary"
              onClick={(e) => {
                onBuyNow(selectedBook.id, e);
                onHide();
              }}
              className="book-action-btn"
              disabled={!selectedBook.inStock || selectedBook.stock === 0}
            >
              <FontAwesomeIcon icon={faTruck} className="me-2" />
              Buy Now
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline-danger"
              onClick={() => {
                onHide();
                navigate("/login");
              }}
              className="book-action-btn"
            >
              <FontAwesomeIcon icon={faHeartRegular} className="me-2" />
              Login for Wishlist
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => {
                onHide();
                navigate("/login");
              }}
              className="book-action-btn"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              Login to Add to Cart
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onHide();
                navigate("/login");
              }}
              className="book-action-btn"
            >
              <FontAwesomeIcon icon={faTruck} className="me-2" />
              Login to Buy
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default BookDetailsModal;