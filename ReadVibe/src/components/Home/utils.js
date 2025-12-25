// Image mapping utility
export const getBookImage = (bookTitle) => {
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

// Book loading and formatting utilities
export const loadStockBooks = () => {
  try {
    const storedBooks = JSON.parse(localStorage.getItem("stockBooks")) || [];
    return storedBooks;
  } catch (error) {
    console.error("Error loading stock books:", error);
    return [];
  }
};

export const formatFeaturedBooks = (stockBooks, getBookImage) => {
  // Get featured books from stock
  let featured = stockBooks.filter(book => book.featured === true);
  
  // If not enough featured books, get top selling books
  if (featured.length < 4) {
    featured = [...stockBooks]
      .sort((a, b) => b.salesThisMonth - a.salesThisMonth)
      .slice(0, 4);
  }
  
  // Format books for home page display
  return featured.map(book => ({
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
    status: book.status,
    description: book.description || "No description available.",
    publisher: book.publisher,
    publishedDate: book.publicationYear?.toString(),
    isbn: book.isbn,
    language: book.language,
    pages: book.pages,
    salesThisMonth: book.salesThisMonth,
    reviewHighlights: [
      {
        user: "Verified Reader",
        rating: 5,
        comment: `Sold ${book.salesThisMonth} copies this month! Highly recommended.`
      },
      {
        user: "Book Lover",
        rating: 4,
        comment: "Great addition to my collection!"
      }
    ]
  }));
};

// Community post utilities
export const handleCommunityPostLike = (communityPosts, setCommunityPosts, postId, isLoggedIn, navigate) => {
  if (!isLoggedIn()) {
    alert("Please login to like posts");
    navigate("/login");
    return communityPosts;
  }

  return communityPosts.map((post) =>
    post.id === postId
      ? {
          ...post,
          likedByUser: !post.likedByUser,
          likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
        }
      : post
  );
};

export const handleCommunityPostComment = (communityPosts, setCommunityPosts, postId, commentText, currentUser) => {
  if (!commentText.trim()) return communityPosts;

  const newComment = {
    user: currentUser?.username || "You",
    comment: commentText,
  };

  return communityPosts.map((post) =>
    post.id === postId
      ? {
          ...post,
          comments: post.comments + 1,
          commentsList: [...post.commentsList, newComment],
        }
      : post
  );
};

export const handleCommunityPostShare = (post, isLoggedIn, navigate) => {
  if (!isLoggedIn()) {
    alert("Please login to share posts");
    navigate("/login");
    return;
  }

  const shareText = `${post.user}: ${post.content}\n\nCheck out this discussion on ReadVibe!`;

  if (navigator.share) {
    navigator.share({
      title: `ReadVibe Community Post`,
      text: shareText,
      url: window.location.href,
    }).catch((error) => console.log("Error sharing:", error));
  } else {
    navigator.clipboard.writeText(shareText)
      .then(() => alert("Post link copied to clipboard!"))
      .catch(() => {
        const textArea = document.createElement("textarea");
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Post content copied!");
      });
  }
};

// Book action utilities
export const handleAddToCart = (bookId, featuredBooks, stockBooks, isLoggedIn, navigate) => {
  if (!isLoggedIn()) {
    alert("Please login to add items to cart");
    navigate("/login");
    return false;
  }

  // Find the book in featuredBooks or stockBooks
  const book = featuredBooks.find(b => b.id === bookId) || 
               stockBooks.find(b => b.id === bookId);
  
  if (!book) {
    alert("Book not found in inventory");
    return false;
  }

  if (book.stock === 0 || !book.inStock) {
    alert("This book is currently out of stock");
    return false;
  }

  // Check if it's from featuredBooks (with stock property) or from original books
  if (book.stock !== undefined) {
    // From stock manager
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.id === bookId);
    
    if (existingItem) {
      if (existingItem.quantity >= book.stock) {
        alert(`Only ${book.stock} items available in stock`);
        return false;
      }
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: bookId,
        title: book.title,
        price: book.price,
        quantity: 1,
        image: book.image,
        stock: book.stock
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart-updated"));
    return true;
  }
  return false;
};

export const getStockBadge = (book) => {
  if (book.stock > 10) {
    return { variant: "success", text: "In Stock" };
  } else if (book.stock > 0) {
    return { variant: "warning", text: "Low Stock" };
  } else {
    return { variant: "danger", text: "Out of Stock" };
  }
};

// Import existing helpers - FIXED PATH
export { formatPrice, generateStarRating, addToWishlist } from "../../utils/helpers";