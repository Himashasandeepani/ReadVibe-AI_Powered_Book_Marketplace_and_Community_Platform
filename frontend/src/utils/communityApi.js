const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const handleApi = async (path, options = {}) => {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const validationMsg = Array.isArray(data?.errors)
      ? data.errors.map((e) => e.msg || e.message).filter(Boolean).join("; ")
      : null;
    const msg = validationMsg || data?.error || data?.message || "Request failed";
    const err = new Error(msg);
    err.status = res.status;
    err.details = data;
    throw err;
  }
  return data;
};

const resolveUserId = (raw) => {
  const candidate = raw ?? null;
  const parsed = Number(
    candidate?.id ?? candidate?.user_id ?? candidate?.userId ?? candidate,
  );
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("userId is required to perform this action");
  }
  return parsed;
};

export const fetchCommunityPostsApi = async ({ userId } = {}) => {
  const headers = {};
  if (userId) {
    headers["x-user-id"] = userId;
  }

  const data = await handleApi(`/api/community/posts`, { headers });
  return data.posts || [];
};

export const fetchCommunityPostWithCommentsApi = async (postId, { userId } = {}) => {
  const headers = {};
  if (userId) {
    headers["x-user-id"] = userId;
  }

  const data = await handleApi(`/api/community/posts/${postId}`, { headers });
  return { post: data.post, comments: data.comments || [] };
};

export const createCommunityPostApi = async ({ userId, content, category, bookId }) => {
  const uid = resolveUserId(userId);

  const body = {
    userId: uid,
    content: (content || "").trim(),
    category,
  };

  const parsedBookId = Number(bookId);
  if (Number.isInteger(parsedBookId) && parsedBookId > 0) {
    body.bookId = parsedBookId;
  }

  const data = await handleApi(`/api/community/posts`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "x-user-id": uid,
    },
  });

  return data.post;
};

export const toggleCommunityPostLikeApi = async ({ userId, postId }) => {
  const uid = resolveUserId(userId);

  const data = await handleApi(`/api/community/posts/${postId}/like`, {
    method: "POST",
    headers: {
      "x-user-id": uid,
    },
  });

  return data; // { liked, likesCount }
};

export const addCommunityCommentApi = async ({ userId, postId, content }) => {
  const uid = resolveUserId(userId);

  const data = await handleApi(`/api/community/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ userId: uid, content }),
    headers: {
      "x-user-id": uid,
    },
  });

  return data.comments || [];
};

export const deleteCommunityPostApi = async ({ userId, postId }) => {
  const uid = resolveUserId(userId);

  await handleApi(`/api/community/posts/${postId}`, {
    method: "DELETE",
    headers: {
      "x-user-id": uid,
    },
  });

  return true;
};

export const createBookRequestApi = async ({
  userId,
  bookTitle,
  author,
  isbn,
  category,
  reason,
}) => {
  const uid = resolveUserId(userId);

  const body = {
    userId: uid,
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
      "x-user-id": uid,
    },
  });

  return data.request;
};
