// Format helpers
import { formatPrice, formatDate, showNotification } from "../../utils/helpers";
import { getCurrentUser } from "../../utils/auth";

// Sample books data
export const books = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 6000.0,
    category: "Fiction",
    rating: 4.3,
    reviews: 128,
    inStock: true,
    image: "https://via.placeholder.com/200x300/DBEAFE/1E3A5F?text=Book+Cover",
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
    image: "https://via.placeholder.com/200x300/DBEAFE/1E3A5F?text=Book+Cover",
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
    image: "https://via.placeholder.com/200x300/DBEAFE/1E3A5F?text=Book+Cover",
  },
];

// Load user data
export const loadUserData = (user) => {
  // Load orders
  const storedOrders = JSON.parse(localStorage.getItem("userOrders")) || [];
  const userOrders = storedOrders.filter(
    (order) => order.userId === user.id
  );

  // Load reviews
  const storedReviews = JSON.parse(localStorage.getItem("userReviews")) || [];
  const userReviews = storedReviews.filter(
    (review) => review.userId === user.id
  );

  // Load book requests
  const storedRequests = JSON.parse(localStorage.getItem("bookRequests")) || [];
  const userRequests = storedRequests.filter(
    (request) => request.userId === user.id
  );

  // Calculate stats
  const booksRead = userOrders.reduce(
    (total, order) =>
      total + order.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  );

  const wishlistItems =
    JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
  const communityPosts =
    JSON.parse(localStorage.getItem("communityPosts")) || [];
  const userPosts = communityPosts.filter(
    (post) => post.user.name === user.name
  );

  const userStats = {
    booksRead,
    reviewsWritten: userReviews.length,
    wishlistCount: wishlistItems.length,
    communityPosts: userPosts.length,
    myBookRequests: userRequests.length,
  };

  // Load recent activity
  const recentActivity = loadRecentActivity(userOrders, userReviews);

  return {
    orders: userOrders,
    reviews: userReviews,
    bookRequests: userRequests,
    userStats,
    recentActivity,
  };
};

// Load recent activity
export const loadRecentActivity = (userOrders, userReviews) => {
  const activities = [];

  // Add recent orders
  userOrders.slice(0, 2).forEach((order) => {
    activities.push({
      type: "purchase",
      text: `You purchased ${order.items.length} book(s)`,
      time: formatDate(order.orderDate),
      icon: "shoppingBag",
    });
  });

  // Add recent reviews
  userReviews.slice(0, 1).forEach((review) => {
    activities.push({
      type: "review",
      text: `You reviewed "${review.bookTitle}"`,
      time: formatDate(review.date),
      icon: "star",
    });
  });

  // Sort by time (newest first)
  return activities.sort((a, b) => new Date(b.time) - new Date(a.time));
};

// Generate star rating HTML
export const generateStarRating = (rating) => {
  let starsHTML = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      starsHTML += '<i class="fas fa-star text-warning"></i>';
    } else if (i - 0.5 === rating) {
      starsHTML += '<i class="fas fa-star-half-alt text-warning"></i>';
    } else {
      starsHTML += '<i class="far fa-star text-warning"></i>';
    }
  }
  return starsHTML;
};

// Update user profile
export const updateUserProfile = (user, updatedData) => {
  const updatedUser = {
    ...user,
    ...updatedData,
  };

  localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  return updatedUser;
};

// Submit book request
export const submitBookRequest = (user, requestData) => {
  const newRequest = {
    id: Date.now(),
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    bookTitle: requestData.title,
    author: requestData.author,
    isbn: requestData.isbn,
    category: requestData.category,
    reason: requestData.reason,
    status: "Pending",
    dateRequested: new Date().toISOString(),
    dateUpdated: new Date().toISOString(),
  };

  const storedRequests = JSON.parse(localStorage.getItem("bookRequests")) || [];
  storedRequests.push(newRequest);
  localStorage.setItem("bookRequests", JSON.stringify(storedRequests));

  return newRequest;
};

// Submit review
export const submitReview = (user, book, reviewData, orderId = null) => {
  const reviewId = "REV_" + Date.now();
  const newReview = {
    id: reviewId,
    bookId: reviewData.bookId.toString(),
    bookTitle: book.title,
    bookAuthor: book.author,
    bookImage: book.image,
    userId: user.id,
    userName: user.name,
    userAvatar: user.avatar || user.name.substring(0, 2).toUpperCase(),
    rating: reviewData.rating,
    title: reviewData.title.trim(),
    text: reviewData.text.trim(),
    recommend: reviewData.recommend,
    date: new Date().toISOString(),
    helpfulVotes: 0,
    verifiedPurchase: true,
    orderId: orderId,
  };

  // Save to book reviews
  const bookReviews = JSON.parse(localStorage.getItem("bookReviews")) || [];
  bookReviews.push(newReview);
  localStorage.setItem("bookReviews", JSON.stringify(bookReviews));

  // Save to user reviews
  const userReviews = JSON.parse(localStorage.getItem("userReviews")) || [];
  userReviews.push({
    ...newReview,
    id: "USER_" + reviewId,
  });
  localStorage.setItem("userReviews", JSON.stringify(userReviews));

  return { ...newReview, id: "USER_" + reviewId };
};

// Delete review
export const deleteReview = (reviewId, userId) => {
  // Update user reviews
  const userReviews = JSON.parse(localStorage.getItem("userReviews")) || [];
  const filteredUserReviews = userReviews.filter(
    (review) => review.id !== reviewId
  );
  localStorage.setItem("userReviews", JSON.stringify(filteredUserReviews));

  // Also remove from book reviews
  const bookReviews = JSON.parse(localStorage.getItem("bookReviews")) || [];
  const reviewToDelete = userReviews.find((r) => r.id === reviewId);
  if (reviewToDelete) {
    const filteredBookReviews = bookReviews.filter(
      (r) => !(r.bookId === reviewToDelete.bookId && r.userId === userId)
    );
    localStorage.setItem("bookReviews", JSON.stringify(filteredBookReviews));
  }
};

// Find unreviewed items in an order
export const findUnreviewedItems = (order, userReviews) => {
  return order.items.filter((item) => {
    return !userReviews.some((review) => review.bookId === item.id.toString());
  });
};

export { formatPrice, formatDate, showNotification, getCurrentUser };