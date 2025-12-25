// Helper functions for the Community page

// Generate unique post ID
export const generatePostId = (communityPosts) => {
  try {
    const posts = JSON.parse(localStorage.getItem("communityPosts")) || [];
    if (posts.length > 0 && posts[0].id) {
      const lastId = parseInt(posts[0].id.substring(1)) || posts.length;
      return `P${String(lastId + 1).padStart(3, "0")}`;
    }
  } catch (error) {
    console.error("Error generating post ID:", error);
  }
  return `P${String((communityPosts.length || 0) + 1).padStart(3, "0")}`;
};

// Get user avatar
export const getUserAvatar = (user) => {
  if (!user) return "US";

  if (
    typeof user === "object" &&
    user.userDisplay &&
    user.userDisplay.avatar
  ) {
    return user.userDisplay.avatar;
  }

  if (typeof user === "object" && user.name) {
    return user.name.substring(0, 2).toUpperCase();
  }

  if (typeof user === "string") {
    return user.substring(0, 2).toUpperCase();
  }

  return "US";
};

// Get user name
export const getUserName = (user) => {
  if (!user) return "User";

  if (typeof user === "object" && user.userDisplay && user.userDisplay.name) {
    return user.userDisplay.name;
  }

  if (typeof user === "object" && user.name) {
    return user.name;
  }

  if (typeof user === "string") {
    return user
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return "User";
};

// Format timestamp for display
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "Recently";

  try {
    const postDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return postDate.toLocaleDateString();
  } catch (error) {
    return "Recently";
  }
};

// Update post in admin panel storage
export const updatePostInAdminPanel = (updatedPost) => {
  try {
    const adminPosts =
      JSON.parse(localStorage.getItem("adminCommunityPosts")) || [];
    const adminPostIndex = adminPosts.findIndex(
      (p) => p.id === updatedPost.id
    );

    if (adminPostIndex !== -1) {
      const adminPost = { ...updatedPost };
      delete adminPost.userDisplay;
      adminPosts[adminPostIndex] = adminPost;
      localStorage.setItem("adminCommunityPosts", JSON.stringify(adminPosts));
    }
  } catch (error) {
    console.error("Error updating admin panel:", error);
  }
};

// Initial posts data
export const initialPosts = [
  {
    id: "P001",
    user: "john_doe",
    content:
      "Just finished 'Project Hail Mary' and it's absolutely mind-blowing! The character development is incredible. Highly recommend to all sci-fi lovers!",
    image: "/assets/The_Midnight_Library.jpeg",
    likes: 24,
    comments: 8,
    status: "Active",
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    category: "Book Review",
    commentsList: [
      {
        user: "sarah_j",
        content:
          "I totally agree! The ending had me in tears. One of the best books I've read this year.",
        timestamp: new Date(Date.now() - 3600000)
          .toISOString()
          .replace("T", " ")
          .substring(0, 19),
      },
    ],
    likedBy: [],
    userDisplay: {
      name: "John Doe",
      avatar: "JD",
    },
  },
  {
    id: "P002",
    user: "sarah_j",
    content:
      "Looking for fantasy recommendations similar to Brandon Sanderson's works. Any suggestions? I've already read Wheel of Time and Kingkiller Chronicle.",
    likes: 45,
    comments: 12,
    status: "Active",
    timestamp: new Date(Date.now() - 18000000)
      .toISOString()
      .replace("T", " ")
      .substring(0, 19),
    category: "Recommendation",
    commentsList: [],
    likedBy: [],
    userDisplay: {
      name: "Sarah Johnson",
      avatar: "SJ",
    },
  },
];

// Top contributors data
export const topContributors = [
  { name: "John Doe", avatar: "JD", posts: 124 },
  { name: "Sarah Johnson", avatar: "SJ", posts: 98 },
  { name: "Mike Brown", avatar: "MB", posts: 76 },
];

// Popular tags data
export const popularTags = [
  "#Fantasy",
  "#SciFi",
  "#Mystery",
  "#Romance",
  "#Classics",
  "#Biography",
  "#SelfHelp",
  "#Thriller",
];

// Community guidelines
export const communityGuidelines = [
  "Be respectful to all members",
  "No spam or self-promotion",
  "Stay on topic - book discussions only",
  "Spoilers must be marked",
];