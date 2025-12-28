import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pages/Community.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Import components
import Header from "../components/Community/Header";
import GuestNotice from "../components/Community/GuestNotice";
import EmptyState from "../components/Community/EmptyState";
import PostCard from "../components/Community/PostCard";
import Sidebar from "../components/Community/Sidebar";
import CreatePostModal from "../components/Community/CreatePostModal";
import RequestBookModal from "../components/Community/RequestBookModal";

const Community = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  // Fixed: Safe initialization of communityPosts
  const [communityPosts, setCommunityPosts] = useState(() => {
    try {
      const savedPosts = JSON.parse(localStorage.getItem("communityPosts"));
      if (Array.isArray(savedPosts) && savedPosts.length > 0) {
        return savedPosts;
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    }

    // Initial posts with Admin Panel compatible structure
    return [
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
  });

  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showRequestBookModal, setShowRequestBookModal] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState("Discussion");
  const [selectedBook, setSelectedBook] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  // Book request form state
  const [requestForm, setRequestForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    reason: "",
  });

  const topContributors = [
    { name: "John Doe", avatar: "JD", posts: 124 },
    { name: "Sarah Johnson", avatar: "SJ", posts: 98 },
    { name: "Mike Brown", avatar: "MB", posts: 76 },
  ];

  const popularTags = [
    "#Fantasy",
    "#SciFi",
    "#Mystery",
    "#Romance",
    "#Classics",
    "#Biography",
    "#SelfHelp",
    "#Thriller",
  ];

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    }

    // Load posts from localStorage on component mount
    try {
      const savedPosts = JSON.parse(localStorage.getItem("communityPosts"));
      if (Array.isArray(savedPosts)) {
        setCommunityPosts(savedPosts);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  }, []);

  // Function to generate unique post ID
  const generatePostId = () => {
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

  // Safe function to get user avatar
  const getUserAvatar = (user) => {
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

  // Safe function to get user name
  const getUserName = (user) => {
    if (!user) return "User";

    if (typeof user === "object" && user.userDisplay && user.userDisplay.name) {
      return user.userDisplay.name;
    }

    if (typeof user === "object" && user.name) {
      return user.name;
    }

    if (typeof user === "string") {
      // Convert username like "john_doe" to "John Doe"
      return user
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    return "User";
  };

  // Enhanced function to check if user can create post
  const canCreatePost = () => {
    if (!currentUser) {
      return {
        canProceed: false,
        message: "Please login to create posts",
        redirectTo: "/login"
      };
    }
    return { canProceed: true };
  };

  // Enhanced function to check if user can like or comment
  const canInteract = () => {
    if (!currentUser) {
      return {
        canProceed: false,
        message: "Please login to interact with posts",
        redirectTo: "/login"
      };
    }
    return { canProceed: true };
  };

  // Enhanced function to check if user can request book
  const canRequestBook = () => {
    if (!currentUser) {
      return {
        canProceed: false,
        message: "Please login to request books",
        redirectTo: "/login"
      };
    }
    return { canProceed: true };
  };

  const handleCreatePost = () => {
    const check = canCreatePost();
    if (!check.canProceed) {
      if (window.confirm(`${check.message}. Do you want to login now?`)) {
        navigate(check.redirectTo);
      }
      return;
    }

    if (!postContent.trim()) {
      alert("Please enter post content");
      return;
    }

    // Generate new post with Admin Panel compatible structure
    const newPost = {
      id: generatePostId(),
      user:
        currentUser.username ||
        currentUser.name?.toLowerCase().replace(/\s+/g, "_") ||
        "user",
      content: postContent,
      category: postCategory,
      bookReference: selectedBook !== "Select a book..." ? selectedBook : null,
      image: "", // In real app, handle image upload
      likes: 0,
      comments: 0,
      status: "Active",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      commentsList: [],
      likedBy: [],
      // For community page display
      userDisplay: {
        name: currentUser.name || currentUser.username || "User",
        avatar: currentUser.name
          ? currentUser.name.substring(0, 2).toUpperCase()
          : "US",
      },
    };

    // Get existing posts and add new one at the beginning
    const existingPosts =
      JSON.parse(localStorage.getItem("communityPosts")) || [];
    const updatedPosts = [newPost, ...existingPosts];

    // Update state and localStorage
    setCommunityPosts(updatedPosts);
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts));

    // Update Admin Panel data if it exists
    const adminPanelPosts =
      JSON.parse(localStorage.getItem("adminCommunityPosts")) || [];
    const adminPost = {
      ...newPost,
      // Remove community-specific display fields for admin panel
      userDisplay: undefined,
    };
    const updatedAdminPosts = [adminPost, ...adminPanelPosts];
    localStorage.setItem(
      "adminCommunityPosts",
      JSON.stringify(updatedAdminPosts)
    );

    // Reset form
    setPostContent("");
    setPostCategory("Discussion");
    setSelectedBook("");
    setShowCreatePostModal(false);

    // Show success message
    alert(
      "Post created successfully! It will now appear in the Admin Panel for review."
    );
  };

  const handleLikePost = (postId) => {
    const check = canInteract();
    if (!check.canProceed) {
      if (window.confirm(`${check.message}. Do you want to login now?`)) {
        navigate(check.redirectTo);
      }
      return;
    }

    const updatedPosts = communityPosts.map((post) => {
      if (post.id === postId) {
        const userIndex = post.likedBy.indexOf(currentUser.id);

        if (userIndex === -1) {
          // Add like
          const updatedPost = {
            ...post,
            likes: post.likes + 1,
            likedBy: [...post.likedBy, currentUser.id],
          };

          // Also update in admin posts
          updatePostInAdminPanel(updatedPost);

          return updatedPost;
        } else {
          // Remove like
          const newLikedBy = [...post.likedBy];
          newLikedBy.splice(userIndex, 1);
          const updatedPost = {
            ...post,
            likes: post.likes - 1,
            likedBy: newLikedBy,
          };

          // Also update in admin posts
          updatePostInAdminPanel(updatedPost);

          return updatedPost;
        }
      }
      return post;
    });

    setCommunityPosts(updatedPosts);
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts));
  };

  // Helper function to update post in admin panel storage
  const updatePostInAdminPanel = (updatedPost) => {
    try {
      const adminPosts =
        JSON.parse(localStorage.getItem("adminCommunityPosts")) || [];
      const adminPostIndex = adminPosts.findIndex(
        (p) => p.id === updatedPost.id
      );

      if (adminPostIndex !== -1) {
        // Clone the post without community-specific fields
        const adminPost = { ...updatedPost };
        delete adminPost.userDisplay;

        adminPosts[adminPostIndex] = adminPost;
        localStorage.setItem("adminCommunityPosts", JSON.stringify(adminPosts));
      }
    } catch (error) {
      console.error("Error updating admin panel:", error);
    }
  };

  const handleAddComment = (postId, commentText) => {
    const check = canInteract();
    if (!check.canProceed) {
      if (window.confirm(`${check.message}. Do you want to login now?`)) {
        navigate(check.redirectTo);
      }
      return;
    }

    const comment = commentText || "";
    if (!comment.trim()) return;

    const updatedPosts = communityPosts.map((post) => {
      if (post.id === postId) {
        const newComment = {
          user:
            currentUser.username ||
            currentUser.name?.toLowerCase().replace(/\s+/g, "_") ||
            "user",
          content: comment,
          timestamp: new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 19),
          // For community display
          userDisplay: {
            name: currentUser.name || currentUser.username || "User",
            avatar: currentUser.name
              ? currentUser.name.substring(0, 2).toUpperCase()
              : "US",
          },
        };

        const updatedPost = {
          ...post,
          comments: post.comments + 1,
          commentsList: [newComment, ...post.commentsList],
        };

        // Also update in admin posts
        updatePostInAdminPanel(updatedPost);

        return updatedPost;
      }
      return post;
    });

    setCommunityPosts(updatedPosts);
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts));

    // Clear comment input
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  // Enhanced modal open handlers with login check
  const handleOpenCreatePostModal = () => {
    const check = canCreatePost();
    if (!check.canProceed) {
      if (window.confirm(`${check.message}. Do you want to login now?`)) {
        navigate(check.redirectTo);
      }
      return;
    }
    setShowCreatePostModal(true);
  };

  const handleOpenRequestBookModal = () => {
    const check = canRequestBook();
    if (!check.canProceed) {
      if (window.confirm(`${check.message}. Do you want to login now?`)) {
        navigate(check.redirectTo);
      }
      return;
    }
    setShowRequestBookModal(true);
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleSharePost = (postId) => {
    const post = communityPosts.find((p) => p.id === postId);
    if (!post) return;

    const shareText = `Check out this book discussion on ReadVibe: "${post.content.substring(
      0,
      100
    )}..."`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: "ReadVibe Community Post",
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareText + "\n\n" + shareUrl);
      alert("Post link copied to clipboard!");
    }
  };

  const handleRequestBook = () => {
    const check = canRequestBook();
    if (!check.canProceed) {
      if (window.confirm(`${check.message}. Do you want to login now?`)) {
        navigate(check.redirectTo);
      }
      return;
    }

    if (!requestForm.title || !requestForm.author || !requestForm.reason) {
      alert("Please fill in all required fields");
      return;
    }

    const bookRequests = JSON.parse(localStorage.getItem("bookRequests")) || [];
    const newRequest = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      bookTitle: requestForm.title,
      author: requestForm.author,
      isbn: requestForm.isbn,
      category: requestForm.category,
      reason: requestForm.reason,
      status: "Pending",
      dateRequested: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
    };

    bookRequests.push(newRequest);
    localStorage.setItem("bookRequests", JSON.stringify(bookRequests));

    // Reset form
    setRequestForm({
      title: "",
      author: "",
      isbn: "",
      category: "",
      reason: "",
    });
    setShowRequestBookModal(false);

    alert("Book request submitted successfully!");
  };

  const handleTagClick = (tag) => {
    alert(`Filtering by ${tag}`);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
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

  return (
    <div className="community-page">
      {/* Community Content */}
      <div className="container mt-4">
        <Header
          currentUser={currentUser}
          handleOpenCreatePostModal={handleOpenCreatePostModal}
          handleOpenRequestBookModal={handleOpenRequestBookModal}
        />

        {/* Guest Restriction - Enhanced */}
        {!currentUser && <GuestNotice />}

        <div className="row">
          <div className="col-lg-8">
            {/* Posts Container */}
            <div id="postsContainer">
              {communityPosts.length === 0 ? (
                <EmptyState
                  currentUser={currentUser}
                  handleOpenCreatePostModal={handleOpenCreatePostModal}
                />
              ) : (
                communityPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onLike={handleLikePost}
                    onToggleComments={toggleComments}
                    onAddComment={handleAddComment}
                    onShare={handleSharePost}
                    expandedComments={expandedComments}
                    commentInputs={commentInputs}
                    setCommentInputs={setCommentInputs}
                    getUserAvatar={getUserAvatar}
                    getUserName={getUserName}
                    formatTimestamp={formatTimestamp}
                  />
                ))
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <Sidebar
              topContributors={topContributors}
              popularTags={popularTags}
              handleTagClick={handleTagClick}
            />
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        showCreatePostModal={showCreatePostModal}
        setShowCreatePostModal={setShowCreatePostModal}
        postContent={postContent}
        setPostContent={setPostContent}
        postCategory={postCategory}
        setPostCategory={setPostCategory}
        selectedBook={selectedBook}
        setSelectedBook={setSelectedBook}
        handleCreatePost={handleCreatePost}
      />

      {/* Request Book Modal */}
      <RequestBookModal
        showRequestBookModal={showRequestBookModal}
        setShowRequestBookModal={setShowRequestBookModal}
        requestForm={requestForm}
        setRequestForm={setRequestForm}
        handleRequestBook={handleRequestBook}
      />

      {/* Modal backdrop */}
      {(showCreatePostModal || showRequestBookModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default Community;