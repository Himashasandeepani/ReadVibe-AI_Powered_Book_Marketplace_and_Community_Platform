const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const emitBookRequestsUpdated = () => {
  window.dispatchEvent(new CustomEvent("book-requests-updated"));
};

export const emitCommunityPostsUpdated = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("community-posts-updated"));
};

const handleApi = async (path, options = {}) => {
  const { headers = {}, ...restOptions } = options;

  const res = await fetch(`${API_BASE}${path}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.error ||
      data?.message ||
      data?.errors?.[0]?.msg ||
      "Request failed";
    throw new Error(msg);
  }
  return data;
};

export const fetchCommunityPostsApi = async () => {
  const data = await handleApi(`/api/community/posts`);
  return data.posts || [];
};

export const fetchCommunityPostWithCommentsApi = async (postId) => {
  const data = await handleApi(`/api/community/posts/${postId}`);
  return { post: data.post, comments: data.comments || [] };
};

export const createCommunityPostApi = async ({ userId, title, content, category, bookId, bookTitle }) => {
  if (!userId) throw new Error("userId is required to create a post");

  const body = {
    userId,
    title,
    content,
    category,
  };

  if (bookId) {
    body.bookId = bookId;
  }

  if (bookTitle) {
    body.bookTitle = bookTitle;
  }

  const data = await handleApi(`/api/community/posts`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "x-user-id": userId,
    },
  });

  return data.post;
};

export const toggleCommunityPostLikeApi = async ({ userId, postId }) => {
  if (!userId) throw new Error("userId is required to like a post");

  const data = await handleApi(`/api/community/posts/${postId}/like`, {
    method: "POST",
    headers: {
      "x-user-id": userId,
    },
  });

  return data; // { liked, likesCount }
};

export const addCommunityCommentApi = async ({ userId, postId, content }) => {
  if (!userId) throw new Error("userId is required to comment on a post");

  const data = await handleApi(`/api/community/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ userId, content }),
    headers: {
      "x-user-id": userId,
    },
  });

  return data.comments || [];
};

export const createBookRequestApi = async ({
  userId,
  bookTitle,
  author,
  isbn,
  category,
  reason,
}) => {
  if (!userId) throw new Error("userId is required to create a book request");

  const body = {
    userId,
    bookTitle,
    author,
    isbn,
    category,
    reason,
  };

  const data = await handleApi(`/api/community/requests`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "x-user-id": userId,
    },
  });

  emitBookRequestsUpdated();

  return data.request;
};

export const fetchBookRequestsApi = async () => {
  const data = await handleApi(`/api/community/requests`);
  return data.requests || [];
};

export const updateBookRequestStatusApi = async (requestId, status) => {
  const data = await handleApi(`/api/community/requests/${requestId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

  emitBookRequestsUpdated();
  return data.request;
};
