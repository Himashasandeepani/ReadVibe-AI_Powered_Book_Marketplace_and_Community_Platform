import { formatPrice, formatDate, showNotification, getAllBooks } from "../../utils/helpers";
import { getCurrentUser, setCurrentUser } from "../../utils/auth";
import { createBookRequestApi } from "../../utils/communityApi";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const handleApi = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || data?.message || "Request failed";
    throw new Error(message);
  }
  return data;
};

export const books = getAllBooks();

export const generateStarRating = (rating) => {
  const safeRating = Number(rating) || 0;
  return "*".repeat(Math.max(0, Math.min(5, Math.round(safeRating))));
};

const normalizeOrder = (order) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  const shippingAddress = order?.shippingAddress || {};

  return {
    ...order,
    items,
    totals: {
      subtotal: Number(order?.subtotal) || 0,
      shipping: Number(order?.shippingCost) || 0,
      tax: Number(order?.tax) || 0,
      total: Number(order?.total) || 0,
    },
    orderDate: order?.orderDate || order?.createdAt,
    shipping: {
      ...shippingAddress,
      estimatedDelivery:
        shippingAddress?.estimatedDelivery ||
        order?.estimatedDelivery ||
        order?.createdAt ||
        new Date().toISOString(),
    },
    orderNumber: order?.id,
  };
};

const normalizeReview = (review) => ({
  ...review,
  bookId: review?.bookId?.toString?.() ?? String(review?.bookId ?? ""),
  date: review?.date || review?.createdAt,
});

const normalizeActivity = (activity) => ({
  ...activity,
  time: activity?.time ? formatDate(activity.time) : "Recently",
});

export const loadUserData = async (user) => {
  if (!user?.id) {
    return {
      orders: [],
      reviews: [],
      bookRequests: [],
      userStats: {
        booksRead: 0,
        reviewsWritten: 0,
        wishlistCount: 0,
        communityPosts: 0,
        myBookRequests: 0,
      },
      recentActivity: [],
    };
  }

  const data = await handleApi(`/api/profile?userId=${encodeURIComponent(user.id)}`, {
    headers: { "x-user-id": user.id },
  });

  return {
    orders: (data.orders || []).map(normalizeOrder),
    reviews: (data.reviews || []).map(normalizeReview),
    bookRequests: data.bookRequests || [],
    userStats: data.userStats || {
      booksRead: 0,
      reviewsWritten: 0,
      wishlistCount: 0,
      communityPosts: 0,
      myBookRequests: 0,
    },
    recentActivity: (data.recentActivity || []).map(normalizeActivity),
  };
};

export const updateUserProfile = async (user, updatedData) => {
  const data = await handleApi("/api/profile", {
    method: "PUT",
    body: JSON.stringify({
      userId: user.id,
      fullName: updatedData.name,
      email: updatedData.email,
      username: updatedData.username,
    }),
    headers: { "x-user-id": user.id },
  });

  setCurrentUser(data.user);
  return data.user;
};

export const submitBookRequest = async (user, requestData) =>
  createBookRequestApi({
    userId: user.id,
    bookTitle: requestData.title,
    author: requestData.author,
    isbn: requestData.isbn,
    category: requestData.category,
    reason: requestData.reason,
  });

export const submitReview = async (user, book, reviewData, orderId = null) => {
  const data = await handleApi("/api/profile/reviews", {
    method: "POST",
    body: JSON.stringify({
      userId: user.id,
      bookId: reviewData.bookId ?? book.id,
      rating: reviewData.rating,
      title: reviewData.title || "",
      text: reviewData.text.trim(),
      recommend: reviewData.recommend,
      orderId,
    }),
    headers: { "x-user-id": user.id },
  });

  return normalizeReview(data.review);
};

export const deleteReview = async (reviewId, userId) => {
  await handleApi(`/api/profile/reviews/${reviewId}?userId=${encodeURIComponent(userId)}`, {
    method: "DELETE",
    headers: { "x-user-id": userId },
  });
};

export const findUnreviewedItems = (order, userReviews) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  return items.filter((item) => {
    const itemBookId = String(item.bookId ?? item.id ?? "");
    return !userReviews.some((review) => String(review.bookId) === itemBookId);
  });
};

export { formatPrice, formatDate, showNotification, getCurrentUser };
