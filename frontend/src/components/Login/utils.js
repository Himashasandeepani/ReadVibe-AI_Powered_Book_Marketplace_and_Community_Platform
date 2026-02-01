// Demo users for testing
export const DEMO_USERS = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@readvibe.com",
    username: "admin",
    password: "admin123",
    role: "admin",
    avatar: "AU",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Stock Manager",
    email: "stock@readvibe.com",
    username: "stock",
    password: "stock123",
    role: "stock",
    avatar: "SM",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
    password: "john123",
    role: "user",
    avatar: "JD",
    createdAt: new Date().toISOString(),
    readingPreferences: {
      genres: ["Fiction", "Mystery"],
      favoriteAuthors: ["Agatha Christie", "Stephen King"],
      readingGoal: 12,
    },
  },
  {
    id: 4,
    name: "Jane Smith",
    email: "jane@example.com",
    username: "janesmith",
    password: "jane123",
    role: "user",
    avatar: "JS",
    createdAt: new Date().toISOString(),
    readingPreferences: {
      genres: ["Romance", "Fantasy"],
      favoriteAuthors: ["J.K. Rowling", "Nicholas Sparks"],
      readingGoal: 24,
    },
  },
];

// Terms & Conditions Content
export const TERMS_AND_CONDITIONS = `
# ReadVibe Terms and Conditions

## 1. Platform Overview
ReadVibe is an online bookstore with integrated social community features and AI-powered recommendations. Users can purchase books, review purchased books, create posts about books, and interact with other readers.

## 2. Account Registration
- Users must provide accurate information during registration
- You are responsible for maintaining account security
- Notify us immediately of unauthorized account access

## 3. Book Purchases & Reviews
- Purchase books through our secure marketplace
- Review only books you have purchased
- Reviews help improve AI recommendations for all users
- All purchases are final unless defective

## 4. Social Community Features
- Create posts about books and reading experiences
- Like and comment on other users' posts
- Respect community guidelines and other members
- No spam, offensive content, or harassment allowed

## 5. AI-Powered Recommendations
Our AI analyzes:
- Books you purchase and review
- Posts you create and engage with
- Search history (books by name/author)
- Reading preferences and patterns
- These insights generate personalized book suggestions

## 6. Email Recommendations
- Receive personalized book suggestions via email
- Based on your reading history and preferences
- You can opt-out of email recommendations
- Frequency: Weekly or based on your activity

## 7. Data Collection & Privacy
We collect data to:
- Provide personalized recommendations
- Improve our AI algorithms
- Enhance your shopping experience
- Connect you with like-minded readers
Your data is protected under our Privacy Policy

## 8. Community Guidelines
As a reading community:
- Share honest book reviews and experiences
- Respect diverse opinions about books
- Keep discussions book-related and constructive
- No spoilers without warnings
- Credit original authors in discussions

## 9. Intellectual Property
- Book content belongs to respective publishers/authors
- User-generated content remains your property
- ReadVibe gets license to display your content on the platform
- Do not share copyrighted material without permission

## 10. Contact Information
For support: support@readvibe.com
For partnership inquiries: partners@readvibe.com
`;

// Initialize demo users
export const initializeDemoUsers = () => {
  const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

  // Add demo users if they don't exist
  DEMO_USERS.forEach((demoUser) => {
    const userExists = existingUsers.some(
      (user) =>
        user.username === demoUser.username || user.email === demoUser.email
    );

    if (!userExists) {
      existingUsers.push(demoUser);
    }
  });

  localStorage.setItem("users", JSON.stringify(existingUsers));
  return existingUsers;
};

// Find user by credentials
export const findUserByCredentials = (username, password) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  // Try to find user by username or email
  const user = users.find(
    (u) =>
      (u.username === username || u.email === username) &&
      u.password === password
  );

  return user;
};

// Create new user
export const createNewUser = (signupData) => {
  return {
    id: Date.now(),
    name: signupData.name,
    email: signupData.email,
    username: signupData.username,
    password: signupData.password,
    role: "user",
    avatar: signupData.name.substring(0, 2).toUpperCase(),
    createdAt: new Date().toISOString(),
    isVerified: false,
    receiveRecommendations: signupData.receiveRecommendations,
    readingPreferences: {
      genres: [],
      favoriteAuthors: [],
      readingGoal: 12, // Default: 12 books per year
    },
    purchaseHistory: [],
    reviews: [],
    posts: [],
    likedPosts: [],
    searchHistory: [],
  };
};

// Check if user exists
export const checkUserExists = (username, email) => {
  const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
  
  return existingUsers.some(
    (user) => user.username === username || user.email === email
  );
};

// Save user to storage
export const saveUserToStorage = (user) => {
  const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
  existingUsers.push(user);
  localStorage.setItem("users", JSON.stringify(existingUsers));
  return user;
};

// Remove password from user object
export const removePasswordFromUser = (user) => {
  const { password: UNUSED_PASSWORD, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Validate login form
export const validateLoginForm = (loginData) => {
  const errors = {};

  if (!loginData.username.trim()) {
    errors.username = "Username or email is required";
  }

  if (!loginData.password) {
    errors.password = "Password is required";
  }

  return errors;
};

// Validate signup form
export const validateSignupForm = (signupData) => {
  const errors = {};

  if (!signupData.name.trim()) {
    errors.name = "Full name is required";
  }

  if (!signupData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
    errors.email = "Email is invalid";
  }

  if (!signupData.username.trim()) {
    errors.username = "Username is required";
  } else if (signupData.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  if (!signupData.password) {
    errors.password = "Password is required";
  } else if (signupData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (!signupData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (signupData.password !== signupData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!signupData.agreeTerms) {
    errors.agreeTerms = "You must agree to the terms and conditions";
  }

  return errors;
};

// Generate reset code
export const generateResetCode = () => {
  return "123456"; // Demo code
};

// Save reset code
export const saveResetCode = (email, code) => {
  localStorage.setItem(`reset_${email}`, code);
};

// Validate reset code
export const validateResetCode = (email, code) => {
  const storedCode = localStorage.getItem(`reset_${email}`);
  return storedCode === code;
};

// Update user password
export const updateUserPassword = (email, newPassword) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const userIndex = users.findIndex((user) => user.email === email);

  if (userIndex !== -1) {
    users[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.removeItem(`reset_${email}`);
    return true;
  }

  return false;
};

// Redirect based on user role
export const redirectBasedOnRole = (user, navigate) => {
  switch (user.role) {
    case "admin":
      navigate("/admin-panel");
      break;
    case "stock":
      navigate("/stock-manager");
      break;
    case "user":
    default:
      navigate("/");
      break;
  }
};