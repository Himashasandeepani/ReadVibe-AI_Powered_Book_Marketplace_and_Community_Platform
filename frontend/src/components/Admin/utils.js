// Initial sample data
export const initialUsers = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    role: "user",
    status: "active",
    joinDate: "2025-01-15",
  },
  {
    id: 2,
    username: "sarah_j",
    email: "sarah@example.com",
    role: "user",
    status: "active",
    joinDate: "2025-01-20",
  },
  {
    id: 3,
    username: "admin",
    email: "admin@readvibe.com",
    role: "admin",
    status: "active",
    joinDate: "2025-01-01",
  },
  {
    id: 4,
    username: "stock_manager",
    email: "stock@readvibe.com",
    role: "stock",
    status: "active",
    joinDate: "2025-01-01",
  },
  {
    id: 5,
    username: "book_lover",
    email: "book@example.com",
    role: "user",
    status: "active",
    joinDate: "2025-01-25",
  },
  {
    id: 6,
    username: "admin2",
    email: "admin2@readvibe.com",
    role: "admin",
    status: "active",
    joinDate: "2025-01-05",
  },
  {
    id: 7,
    username: "stock2",
    email: "stock2@readvibe.com",
    role: "stock",
    status: "active",
    joinDate: "2025-01-10",
  },
];

export const initialStatuses = [
  { id: 1, status: "Active", isActive: true },
  { id: 2, status: "Inactive", isActive: true },
  { id: 3, status: "Pending", isActive: true },
];

export const initialCommunityPosts = [
  {
    id: "P001",
    user: "john_doe",
    content:
      "Just finished Project Hail Mary by Andy Weir. Absolutely mind-blowing! The science was fascinating and the character development was superb. Highly recommend to all sci-fi lovers!",
    likes: 24,
    comments: 8,
    status: "Active",
    timestamp: "2025-01-20 14:30:00",
    category: "Book Review",
  },
  {
    id: "P002",
    user: "sarah_j",
    content:
      "Looking for fantasy recommendations similar to Brandon Sanderson's Stormlight Archive. I've already read Wheel of Time and Kingkiller Chronicle. Any other epic fantasy series I should check out?",
    likes: 45,
    comments: 12,
    status: "Active",
    timestamp: "2025-01-19 10:15:00",
    category: "Recommendation",
  },
  {
    id: "P003",
    user: "mike_b",
    content:
      "Has anyone read Dune? I'm about to start the series and would love to hear thoughts without spoilers. How does it compare to modern sci-fi?",
    likes: 18,
    comments: 5,
    status: "Flagged",
    timestamp: "2025-01-18 16:45:00",
    category: "Discussion",
  },
];

export const initialSystemSettings = {
  platformName: "ReadVibe",
  maintenanceMode: "Disabled",
  emailNotifications: true,
};

// Load data from localStorage

export const loadData = () => {
  const storedUsers = JSON.parse(localStorage.getItem("adminUsers"));
  const adminPosts = JSON.parse(localStorage.getItem("adminCommunityPosts"));
  const communityPosts = JSON.parse(localStorage.getItem("communityPosts"));
  const storedSettings = JSON.parse(localStorage.getItem("systemSettings"));
  const storedStatuses = JSON.parse(localStorage.getItem("adminStatuses"));

  let users = storedUsers || initialUsers;
  let posts = adminPosts || initialCommunityPosts;
  let settings = storedSettings || initialSystemSettings;
  let statuses = Array.isArray(storedStatuses) ? storedStatuses : initialStatuses;

  // If no admin posts but community posts exist, convert them
  if (!adminPosts && communityPosts && communityPosts.length > 0) {
    posts = communityPosts.map((post) => {
      // Extract user name properly
      let userName = "user";
      if (typeof post.user === 'object') {
        userName = post.user.name || post.user.username || "user";
      } else {
        userName = post.user || "user";
      }

      return {
        id: post.id || `P${Math.random().toString(36).substr(2, 9)}`,
        user: userName, // Store as string, not object
        content: post.content || "",
        likes: post.likes || 0,
        comments: post.comments || 0,
        status: post.status || "Active",
        timestamp: post.timestamp || new Date().toISOString().replace("T", " ").substring(0, 19),
        category: post.category || "Discussion",
      };
    });
    localStorage.setItem("adminCommunityPosts", JSON.stringify(posts));
  }

  return { users, posts, settings, statuses };
};

// Save data to localStorage
export const saveData = (users, posts, settings, statuses) => {
  if (users) localStorage.setItem("adminUsers", JSON.stringify(users));
  if (posts) localStorage.setItem("adminCommunityPosts", JSON.stringify(posts));
  if (settings) localStorage.setItem("systemSettings", JSON.stringify(settings));
   if (statuses) localStorage.setItem("adminStatuses", JSON.stringify(statuses));
};

// Role badge styling
export const getRoleBadgeClass = (role) => {
  switch (role) {
    case "admin":
      return "badge bg-warning text-dark";
    case "stock":
      return "badge bg-info text-dark";
    case "user":
      return "badge bg-primary";
    default:
      return "badge bg-secondary";
  }
};

// Status badge styling
export const getStatusBadgeClass = (status) => {
  switch (status) {
    case "active":
    case "Active":
      return "badge bg-success";
    case "Flagged":
      return "badge bg-danger";
    case "New":
      return "badge bg-warning";
    default:
      return "badge bg-secondary";
  }
};

// Filter users by role
export const filterUsersByRole = (users, role) => {
  if (role === "all") return users;
  return users.filter((user) => user.role === role);
};

// Calculate user stats
export const calculateUserStats = (users) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    newThisMonth: users.filter((user) => {
      const joinDate = new Date(user.joinDate);
      return joinDate >= thirtyDaysAgo;
    }).length,
  };
};

// Calculate post stats
export const calculatePostStats = (posts) => {
  return {
    total: posts.length,
    flagged: posts.filter((p) => p.status === "Flagged").length,
    totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
    totalComments: posts.reduce((sum, post) => sum + post.comments, 0),
  };
};

// Validate new user
export const validateNewUser = (user, existingUsers) => {
  const errors = [];

  if (!user.username) errors.push("Username is required");
  if (!user.email) errors.push("Email is required");
  if (!user.password) errors.push("Password is required");
  
  if (user.password !== user.confirmPassword) {
    errors.push("Passwords do not match");
  }

  const existingUser = existingUsers.find(
    (u) => u.username === user.username || u.email === user.email
  );
  if (existingUser) {
    errors.push("Username or email already exists");
  }

  return errors;
};

// Validate edit user
export const validateEditUser = (user, editingUser, existingUsers) => {
  const errors = [];

  if (!user.username) errors.push("Username is required");
  if (!user.email) errors.push("Email is required");

  const existingUser = existingUsers.find(
    (u) =>
      u.id !== editingUser.id &&
      (u.username === user.username || u.email === user.email)
  );
  if (existingUser) {
    errors.push("Username or email already exists");
  }

  return errors;
};

// Show notification
export const showNotification = (message, type = "success") => {
  const notification = document.createElement("div");
  notification.className = `alert alert-${type} position-fixed`;
  notification.style.cssText = `
    top: 80px;
    right: 20px;
    z-index: 9999;
    min-width: 300px;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
};



// Add this helper function to utils.js
export const extractUserName = (userData) => {
  if (!userData) return "Unknown";
  if (typeof userData === 'string') return userData;
  if (typeof userData === 'object') {
    return userData.name || userData.username || userData.email || "Unknown";
  }
  return "Unknown";
};

// Then use it in PostsTable.jsx:
// <td>{extractUserName(post.user)}</td>