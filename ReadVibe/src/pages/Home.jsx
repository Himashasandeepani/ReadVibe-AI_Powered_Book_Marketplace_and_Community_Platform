// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { books } from "../utils/helpers";
// import "../styles/pages/Home.css";

// // Import Components
// import GuestNotice from "../components/Home/GuestNotice";
// import HeroSection from "../components/Home/HeroSection";
// import FeaturesSection from "../components/Home/FeaturesSection";
// import AIInsightsSection from "../components/Home/AIInsightsSection";
// import FeaturedBooks from "../components/Home/FeaturedBooks";
// import CommunityPosts from "../components/Home/CommunityPosts";
// import StatsSection from "../components/Home/StatsSection";
// import BookDetailsModal from "../components/Home/BookDetailsModal";

// const Home = () => {
//   const [featuredBooks, setFeaturedBooks] = useState([]);
//   const [showBookModal, setShowBookModal] = useState(false);
//   const [selectedBook, setSelectedBook] = useState(null);
//   const [userWishlist, setUserWishlist] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setFeaturedBooks(books.slice(0, 4));

//     const user = JSON.parse(localStorage.getItem("currentUser"));
//     setCurrentUser(user);

//     if (user) {
//       const wishlist =
//         JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
//       setUserWishlist(wishlist);
//     }
//   }, []);

//   const isLoggedIn = () => {
//     return currentUser !== null;
//   };

//   const requireLogin = (actionName) => {
//     if (!isLoggedIn()) {
//       alert(`Please login to ${actionName}`);
//       navigate("/login");
//       return false;
//     }
//     return true;
//   };

//   const handleAddToCart = (bookId, e) => {
//     if (e) e.stopPropagation();

//     if (!requireLogin("add items to cart")) return;

//     import("../utils/helpers").then((helpers) => {
//       helpers.addToCart(bookId);
//       alert("Book added to cart!");
//     });
//   };

//   const handleBuyNow = (bookId, e) => {
//     if (e) e.stopPropagation();

//     if (!requireLogin("buy books")) return;

//     import("../utils/helpers").then((helpers) => {
//       helpers.addToCart(bookId);
//       navigate("/delivery-details");
//     });
//   };

//   const handleAddToWishlist = (bookId, e) => {
//     if (e) e.stopPropagation();

//     if (!requireLogin("add items to wishlist")) return;

//     import("../utils/helpers").then((helpers) => {
//       helpers.addToWishlist(bookId, currentUser.id);
//       const updatedWishlist =
//         JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`)) || [];
//       setUserWishlist(updatedWishlist);

//       window.dispatchEvent(new CustomEvent("wishlist-updated"));
//       alert("Book added to wishlist!");
//     });
//   };

//   const handleViewDetails = (book) => {
//     setSelectedBook(book);
//     setShowBookModal(true);
//   };

//   const isInWishlist = (bookId) => {
//     return userWishlist.some((item) => item.id === bookId);
//   };

//   return (
//     <div className="home-page">
//       <BookDetailsModal
//         show={showBookModal}
//         onHide={() => setShowBookModal(false)}
//         book={selectedBook}
//         isLoggedIn={isLoggedIn()}
//         isInWishlist={isInWishlist}
//         onAddToWishlist={handleAddToWishlist}
//         onAddToCart={handleAddToCart}
//         onBuyNow={handleBuyNow}
//         navigate={navigate}
//       />

//       <GuestNotice isLoggedIn={isLoggedIn()} />
//       <HeroSection />
//       <FeaturesSection />
//       <AIInsightsSection />
      
//       <FeaturedBooks
//         featuredBooks={featuredBooks}
//         isLoggedIn={isLoggedIn()}
//         navigate={navigate}
//         handleViewDetails={handleViewDetails}
//         handleAddToWishlist={handleAddToWishlist}
//         handleAddToCart={handleAddToCart}
//         handleBuyNow={handleBuyNow}
//         isInWishlist={isInWishlist}
//       />

//       <CommunityPosts 
//         isLoggedIn={isLoggedIn()} 
//         navigate={navigate} 
//       />
      
//       <StatsSection />
//     </div>
//   );
// };

// export default Home;






import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { books, addToWishlist } from "../utils/helpers";

// Import Components
import GuestNotice from "../components/Home/GuestNotice";
import HeroSection from "../components/Home/HeroSection";
import FeaturesSection from "../components/Home/FeaturesSection";
import AISection from "../components/Home/AISection";
import PopularBooks from "../components/Home/PopularBooks";
import BookDetailsModal from "../components/Home/BookDetailsModal";
import CommunitySection from "../components/Home/CommunitySection";
import StatsSection from "../components/Home/StatsSection";

// Import Utilities
import {
  getBookImage,
  loadStockBooks,
  formatFeaturedBooks,
  handleCommunityPostLike,
  handleCommunityPostComment,
  handleCommunityPostShare,
  handleAddToCart
} from "../components/Home/utils";

import "../styles/pages/Home.css";

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [aiInsight, setAiInsight] = useState(
    "Loading your personalized insight..."
  );
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [userWishlist, setUserWishlist] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [stockBooks, setStockBooks] = useState([]);
  const navigate = useNavigate();

  const [communityPosts, setCommunityPosts] = useState([
    {
      id: 1,
      user: "John Doe",
      initials: "JD",
      time: "2 hours ago",
      content: `"Just finished 'Project Hail Mary' and it's absolutely mind-blowing! The character development is incredible."`,
      likes: 24,
      comments: 8,
      likedByUser: false,
      commentsList: [
        {
          user: "Emily R.",
          comment: `"I loved this book too! The ending was perfect."`,
        },
        {
          user: "Mike T.",
          comment: `"One of the best sci-fi books I've read this year!"`,
        },
      ],
    },
    {
      id: 2,
      user: "Sarah Johnson",
      initials: "SJ",
      time: "5 hours ago",
      content: `"Looking for fantasy recommendations similar to Brandon Sanderson's works. Any suggestions?"`,
      likes: 45,
      comments: 12,
      likedByUser: false,
      commentsList: [
        {
          user: "David L.",
          comment: `"Check out Robert Jordan's Wheel of Time series!"`,
        },
        {
          user: "Anna K.",
          comment: `"Patrick Rothfuss' books are amazing if you haven't read them."`,
        },
      ],
    },
  ]);

  const [commentText, setCommentText] = useState("");
  const [commentText2, setCommentText2] = useState("");

  useEffect(() => {
    // Load current user
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);

    // Load wishlist
    if (user) {
      const wishlist =
        JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
      setUserWishlist(wishlist);
    }

    // Load stock books and set featured books
    const loadedStockBooks = loadStockBooks();
    setStockBooks(loadedStockBooks);
    
    // Format featured books
    const formattedBooks = formatFeaturedBooks(loadedStockBooks, getBookImage);
    setFeaturedBooks(formattedBooks.length > 0 ? formattedBooks : books.slice(0, 4));

    // AI Insight
    setTimeout(() => {
      const insights = [
        "Based on your recent interests, we recommend exploring character-driven sci-fi novels.",
        "You seem to enjoy books with strong philosophical themes and intricate world-building.",
        "Your reading patterns suggest a preference for award-winning literary fiction.",
        "Based on community trends, mystery thrillers with unexpected twists might interest you.",
      ];
      setAiInsight(insights[Math.floor(Math.random() * insights.length)]);
    }, 1000);

    // Listen for stock updates
    const handleStorageUpdate = () => {
      const updatedStockBooks = loadStockBooks();
      setStockBooks(updatedStockBooks);
      const updatedFeaturedBooks = formatFeaturedBooks(updatedStockBooks, getBookImage);
      setFeaturedBooks(updatedFeaturedBooks.length > 0 ? updatedFeaturedBooks : books.slice(0, 4));
    };

    window.addEventListener("storage", handleStorageUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  const isLoggedIn = () => {
    return currentUser !== null;
  };

  const handleLike = (postId) => {
    const updatedPosts = handleCommunityPostLike(
      communityPosts,
      setCommunityPosts,
      postId,
      isLoggedIn,
      navigate
    );
    if (updatedPosts !== communityPosts) {
      setCommunityPosts(updatedPosts);
    }
  };

  const handleComment = (postId) => {
    if (!isLoggedIn()) {
      alert("Please login to comment");
      navigate("/login");
      return;
    }

    const commentInput = document.querySelector(`#comment-input-${postId}`);
    if (commentInput) {
      commentInput.focus();
    }
  };

  const handleAddComment = (postId, commentTextToAdd) => {
    const updatedPosts = handleCommunityPostComment(
      communityPosts,
      setCommunityPosts,
      postId,
      postId === 1 ? commentText : commentText2,
      currentUser
    );
    
    if (updatedPosts !== communityPosts) {
      setCommunityPosts(updatedPosts);
      if (postId === 1) {
        setCommentText("");
      } else {
        setCommentText2("");
      }
      alert("Comment added!");
    }
  };

  const handleShare = (post) => {
    handleCommunityPostShare(post, isLoggedIn, navigate);
  };

  const handleViewDetails = (book) => {
    setSelectedBook(book);
    setShowBookModal(true);
  };

  const handleAddToWishlist = (bookId, e) => {
    if (e) e.stopPropagation();

    if (!isLoggedIn()) {
      alert("Please login to add items to wishlist");
      navigate("/login");
      return;
    }

    addToWishlist(bookId, currentUser.id);
    const updatedWishlist =
      JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`)) || [];
    setUserWishlist(updatedWishlist);

    window.dispatchEvent(new CustomEvent("wishlist-updated"));
    alert("Book added to wishlist!");
  };

  const handleAddToCart = (bookId, e) => {
    if (e) e.stopPropagation();

    const success = handleAddToCart(
      bookId,
      featuredBooks,
      stockBooks,
      isLoggedIn,
      navigate
    );

    if (success) {
      alert("Book added to cart!");
    }
  };

  const handleBuyNow = (bookId, e) => {
    if (e) e.stopPropagation();

    if (!isLoggedIn()) {
      alert("Please login to buy books");
      navigate("/login");
      return;
    }

    // Find the book
    const book = featuredBooks.find(b => b.id === bookId) || 
                 stockBooks.find(b => b.id === bookId);
    
    if (!book) {
      alert("Book not found in inventory");
      return;
    }

    if (book.stock === 0 || !book.inStock) {
      alert("This book is currently out of stock");
      return;
    }

    // Add to cart and navigate
    handleAddToCart(bookId, e);
    navigate("/delivery-details");
  };

  const isInWishlist = (bookId) => {
    return userWishlist.some((item) => item.id === bookId);
  };

  return (
    <div className="home-page">
      <BookDetailsModal
        show={showBookModal}
        onHide={() => setShowBookModal(false)}
        selectedBook={selectedBook}
        isLoggedIn={isLoggedIn()}
        isInWishlist={isInWishlist}
        onAddToWishlist={handleAddToWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {!isLoggedIn() && <GuestNotice />}

      <HeroSection />
      <FeaturesSection />
      <AISection aiInsight={aiInsight} />
      <PopularBooks
        featuredBooks={featuredBooks}
        stockBooks={stockBooks}
        currentUser={currentUser}
        onViewDetails={handleViewDetails}
        onAddToWishlist={handleAddToWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isLoggedIn={isLoggedIn()}
        isInWishlist={isInWishlist}
        navigate={navigate}
      />
      <CommunitySection
        communityPosts={communityPosts}
        isLoggedIn={isLoggedIn()}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        onAddComment={handleAddComment}
        commentText={commentText}
        setCommentText={setCommentText}
        commentText2={commentText2}
        setCommentText2={setCommentText2}
        navigate={navigate}
      />
      <StatsSection stockBooks={stockBooks} />
    </div>
  );
};

export default Home;