import React from "react";
import { Link } from "react-router-dom";

const EmptyState = ({ currentUser, onShowCreatePost }) => {
  return (
    <div className="empty-community-state">
      <i className="fas fa-comments fa-3x mb-3"></i>
      <h4>No posts yet</h4>
      <p>Be the first to share your thoughts about books!</p>
      {currentUser ? (
        <button className="btn btn-primary" onClick={onShowCreatePost}>
          Create First Post
        </button>
      ) : (
        <Link to="/login" className="btn btn-primary">
          Login to Post
        </Link>
      )}
    </div>
  );
};

export default EmptyState;