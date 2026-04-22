const STORAGE_KEY = "homeFeaturedCommunityPostIds";

const normalizeId = (value) => String(value ?? "").trim();

export const getHomeFeaturedCommunityPostIds = () => {
  if (typeof window === "undefined") return [];

  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(stored)) return [];
    return stored.map(normalizeId).filter(Boolean).slice(0, 2);
  } catch {
    return [];
  }
};

export const saveHomeFeaturedCommunityPostIds = (postIds = []) => {
  if (typeof window === "undefined") return [];

  const uniqueIds = [...new Set(postIds.map(normalizeId).filter(Boolean))].slice(0, 2);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueIds));
  return uniqueIds;
};

const sortByRecency = (posts = []) =>
  [...posts].sort((left, right) => {
    const leftTime = new Date(left.createdAt || left.timestamp || 0).getTime();
    const rightTime = new Date(right.createdAt || right.timestamp || 0).getTime();
    return rightTime - leftTime;
  });

export const resolveHomeFeaturedCommunityPosts = (posts = [], selectedIds = []) => {
  const normalizedPosts = Array.isArray(posts) ? posts : [];
  const normalizedSelectedIds = selectedIds.map(normalizeId).filter(Boolean).slice(0, 2);

  const selectedPosts = normalizedSelectedIds
    .map((id) => normalizedPosts.find((post) => normalizeId(post.id) === id))
    .filter(Boolean);

  const fallbackPosts = sortByRecency(normalizedPosts);
  const resolved = [...selectedPosts];

  for (const post of fallbackPosts) {
    if (resolved.length >= 2) break;
    if (!resolved.some((item) => normalizeId(item.id) === normalizeId(post.id))) {
      resolved.push(post);
    }
  }

  return resolved.slice(0, 2);
};