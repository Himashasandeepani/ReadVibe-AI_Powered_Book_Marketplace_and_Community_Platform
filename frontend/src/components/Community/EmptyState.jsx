import React from "react";
import { Link } from "react-router-dom";

const EmptyState = ({ currentUser, handleOpenCreatePostModal }) => {
  return (
    <div className="empty-community-state">
      <i className="fas fa-comments fa-3x mb-3"></i>
      <h4>No posts yet</h4>
      <p>Be the first to share your thoughts about books!</p>
      {currentUser ? (
        <button className="btn btn-primary" onClick={handleOpenCreatePostModal}>
          Create First Post
        </button>
      ) : (
        <div className="d-flex gap-2">
          <Link to="/login" className="btn btn-primary">
            Login to Post
          </Link>
          <Link to="/register" className="btn btn-outline-primary">
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmptyState;