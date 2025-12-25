import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pages/Community.css";

// Import Components
import GuestNotice from "../components/Community/GuestNotice";
import Header from "../components/Community/Header";
import PostCard from "../components/Community/PostCard";
import Sidebar from "../components/Community/Sidebar";
import EmptyState from "../components/Community/EmptyState";
import CreatePostModal from "../components/Community/CreatePostModal";
import RequestBookModal from "../components/Community/RequestBookModal";

// Import Utils
import {
  initialPosts,
  generatePostId,
  updatePostInAdminPanel,
  formatTimestamp
} from "../components/Community/utils";

const Community = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  
  const [communityPosts, setCommunityPosts] = useState(() => {
    try {
      const savedPosts = JSON.parse(localStorage.getItem("communityPosts"));
      if (Array.isArray(savedPosts) && savedPosts.length > 0) {
        return savedPosts;
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    }
    return initialPosts;
  });

  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showRequestBookModal, setShowRequestBookModal] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState("Discussion");
  const [selectedBook, setSelectedBook] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  const [requestForm, setRequestForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    reason: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    }

    try {
      const savedPosts = JSON.parse(localStorage.getItem("communityPosts"));
      if (Array.isArray(savedPosts)) {
        setCommunityPosts(savedPosts);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  }, []);

  const handleCreatePost = () => {
    if (!currentUser) {
      alert("Please login to create posts");
      navigate("/login");
      return;
    }

    if (!postContent.trim()) {
      alert("Please enter post content");
      return;
    }

    const newPost = {
      id: generatePostId(communityPosts),
      user:
        currentUser.username ||
        currentUser.name?.toLowerCase().replace(/\s+/g, "_") ||
        "user",
      content: postContent,
      category: postCategory,
      bookReference: selectedBook !== "Select a book..." ? selectedBook : null,
      image: "",
      likes: 0,
      comments: 0,
      status: "Active",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      commentsList: [],
      likedBy: [],
      userDisplay: {
        name: currentUser.name || currentUser.username || "User",
        avatar: currentUser.name
          ? currentUser.name.substring(0, 2).toUpperCase()
          : "US",
      },
    };

    const existingPosts =
      JSON.parse(localStorage.getItem("communityPosts")) || [];
    const updatedPosts = [newPost, ...existingPosts];

    setCommunityPosts(updatedPosts);
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts));

    const adminPanelPosts =
      JSON.parse(localStorage.getItem("adminCommunityPosts")) || [];
    const adminPost = { ...newPost, userDisplay: undefined };
    const updatedAdminPosts = [adminPost, ...adminPanelPosts];
    localStorage.setItem(
      "adminCommunityPosts",
      JSON.stringify(updatedAdminPosts)
    );

    setPostContent("");
    setPostCategory("Discussion");
    setSelectedBook("");
    setShowCreatePostModal(false);

    alert(
      "Post created successfully! It will now appear in the Admin Panel for review."
    );
  };

  const handleLikePost = (postId) => {
    if (!currentUser) {
      alert("Please login to like posts");
      navigate("/login");
      return;
    }

    const updatedPosts = communityPosts.map((post) => {
      if (post.id === postId) {
        const userIndex = post.likedBy.indexOf(currentUser.id);

        if (userIndex === -1) {
          const updatedPost = {
            ...post,
            likes: post.likes + 1,
            likedBy: [...post.likedBy, currentUser.id],
          };
          updatePostInAdminPanel(updatedPost);
          return updatedPost;
        } else {
          const newLikedBy = [...post.likedBy];
          newLikedBy.splice(userIndex, 1);
          const updatedPost = {
            ...post,
            likes: post.likes - 1,
            likedBy: newLikedBy,
          };
          updatePostInAdminPanel(updatedPost);
          return updatedPost;
        }
      }
      return post;
    });

    setCommunityPosts(updatedPosts);
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts));
  };

  const handleAddComment = (postId) => {
    if (!currentUser) {
      alert("Please login to comment");
      navigate("/login");
      return;
    }

    const comment = commentInputs[postId] || "";
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

        updatePostInAdminPanel(updatedPost);
        return updatedPost;
      }
      return post;
    });

    setCommunityPosts(updatedPosts);
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts));
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
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

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleRequestBook = () => {
    if (!currentUser) {
      alert("Please login to request books");
      navigate("/login");
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

  const handleRequestFormChange = (updates) => {
    setRequestForm(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="community-page">
      <div className="container mt-4">
        <Header
          onShowCreatePost={() => setShowCreatePostModal(true)}
          onShowRequestBook={() => setShowRequestBookModal(true)}
        />

        <GuestNotice currentUser={currentUser} />

        <div className="row">
          <div className="col-lg-8">
            <div id="postsContainer">
              {communityPosts.length === 0 ? (
                <EmptyState
                  currentUser={currentUser}
                  onShowCreatePost={() => setShowCreatePostModal(true)}
                />
              ) : (
                communityPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onLikePost={handleLikePost}
                    onToggleComments={toggleComments}
                    onSharePost={handleSharePost}
                    expandedComments={expandedComments}
                    commentInputs={commentInputs}
                    onCommentChange={handleCommentChange}
                    onAddComment={handleAddComment}
                    formatTimestamp={formatTimestamp}
                  />
                ))
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <Sidebar onTagClick={handleTagClick} />
          </div>
        </div>
      </div>

      <CreatePostModal
        show={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        postContent={postContent}
        setPostContent={setPostContent}
        postCategory={postCategory}
        setPostCategory={setPostCategory}
        selectedBook={selectedBook}
        setSelectedBook={setSelectedBook}
        onCreatePost={handleCreatePost}
      />

      <RequestBookModal
        show={showRequestBookModal}
        onClose={() => setShowRequestBookModal(false)}
        requestForm={requestForm}
        setRequestForm={handleRequestFormChange}
        onRequestBook={handleRequestBook}
      />

      {/* Modal backdrop */}
      {(showCreatePostModal || showRequestBookModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default Community;