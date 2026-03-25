const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const handleApi = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const validationMsg = Array.isArray(data?.errors)
      ? data.errors.map((e) => e.msg || e.message).filter(Boolean).join("; ")
      : null;
    const msg = validationMsg || data?.error || data?.message || "Request failed";
    throw new Error(msg);
  }
  return data;
};

export const fetchWishlistApi = async (userId) => {
  const data = await handleApi(`/api/wishlist?userId=${encodeURIComponent(userId)}`, {
    headers: { "x-user-id": userId },
  });
  return data.items || [];
};

export const addWishlistItemApi = async ({ userId, bookId, priority, notes }) => {
  const uid = Number(userId);
  const bid = Number(bookId);
  if (!Number.isInteger(uid) || uid <= 0) {
    throw new Error("Login required to add to wishlist");
  }
  if (!Number.isInteger(bid) || bid <= 0) {
    throw new Error("Invalid book id for wishlist");
  }
  const data = await handleApi(`/api/wishlist?userId=${encodeURIComponent(uid)}`, {
    method: "POST",
    body: JSON.stringify({ userId: uid, bookId: bid, priority, notes }),
    headers: { "x-user-id": uid },
  });
  return data.items || [];
};

export const updateWishlistItemApi = async ({ userId, bookId, priority, notes }) => {
  const data = await handleApi(`/api/wishlist/${bookId}`, {
    method: "PUT",
    body: JSON.stringify({ userId, priority, notes }),
    headers: { "x-user-id": userId },
  });
  return data.items || [];
};

export const deleteWishlistItemApi = async ({ userId, bookId }) => {
  const data = await handleApi(`/api/wishlist/${bookId}?userId=${encodeURIComponent(userId)}`, {
    method: "DELETE",
    headers: { "x-user-id": userId },
  });
  return data.items || [];
};

export const clearWishlistApi = async (userId) => {
  const data = await handleApi(`/api/wishlist?userId=${encodeURIComponent(userId)}`, {
    method: "DELETE",
    headers: { "x-user-id": userId },
  });
  return data.items || [];
};
