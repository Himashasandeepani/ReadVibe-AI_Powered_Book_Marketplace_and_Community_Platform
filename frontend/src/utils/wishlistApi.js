const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const normalizeId = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const syncWishlistStorage = (userId, items) => {
  const normalizedUserId = normalizeId(userId);
  if (!normalizedUserId) return;

  try {
    localStorage.setItem(
      `wishlist_${normalizedUserId}`,
      JSON.stringify(Array.isArray(items) ? items : []),
    );
    window.dispatchEvent(new CustomEvent("wishlist-updated"));
  } catch (error) {
    console.error("Failed to sync wishlist storage", error);
  }
};

const handleApi = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || data?.message || "Request failed";
    throw new Error(msg);
  }
  return data;
};

export const fetchWishlistApi = async (userId) => {
  const normalizedUserId = normalizeId(userId);
  const data = await handleApi(`/api/wishlist?userId=${encodeURIComponent(normalizedUserId)}`, {
    headers: { "x-user-id": normalizedUserId },
  });
  const items = data.items || [];
  syncWishlistStorage(normalizedUserId, items);
  return items;
};

export const addWishlistItemApi = async ({ userId, bookId, priority, notes }) => {
  const normalizedUserId = normalizeId(userId);
  const normalizedBookId = normalizeId(bookId);

  const data = await handleApi(`/api/wishlist`, {
    method: "POST",
    body: JSON.stringify({
      userId: normalizedUserId,
      bookId: normalizedBookId,
      priority,
      notes,
    }),
    headers: { "x-user-id": normalizedUserId },
  });
  const items = data.items || [];
  syncWishlistStorage(normalizedUserId, items);
  return items;
};

export const updateWishlistItemApi = async ({ userId, bookId, priority, notes }) => {
  const normalizedUserId = normalizeId(userId);
  const normalizedBookId = normalizeId(bookId);

  const data = await handleApi(`/api/wishlist/${normalizedBookId}`, {
    method: "PUT",
    body: JSON.stringify({ userId: normalizedUserId, priority, notes }),
    headers: { "x-user-id": normalizedUserId },
  });
  const items = data.items || [];
  syncWishlistStorage(normalizedUserId, items);
  return items;
};

export const deleteWishlistItemApi = async ({ userId, bookId }) => {
  const normalizedUserId = normalizeId(userId);
  const normalizedBookId = normalizeId(bookId);

  const data = await handleApi(`/api/wishlist/${normalizedBookId}?userId=${encodeURIComponent(normalizedUserId)}`, {
    method: "DELETE",
    headers: { "x-user-id": normalizedUserId },
  });
  const items = data.items || [];
  syncWishlistStorage(normalizedUserId, items);
  return items;
};

export const clearWishlistApi = async (userId) => {
  const normalizedUserId = normalizeId(userId);
  const data = await handleApi(`/api/wishlist?userId=${encodeURIComponent(normalizedUserId)}`, {
    method: "DELETE",
    headers: { "x-user-id": normalizedUserId },
  });
  const items = data.items || [];
  syncWishlistStorage(normalizedUserId, items);
  return items;
};
