import React from "react";
import { getStatusBadgeClass } from "./utils";

const PostModal = ({ show, onClose, post, onDeletePost }) => {
  if (!show || !post) return null;

  // Fix: Extract user name from object if needed
  const userName = typeof post.user === 'object' ? post.user.name || 'Unknown' : post.user;

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        tabIndex="-1"
      >
        <div className="modal-dialog admin-modal modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Post Details</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="post-details">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Post ID:</strong> {post.id}
                  </div>
                  <div className="col-md-6">
                    <strong>Posted by:</strong> {userName}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Category:</strong>{" "}
                    <span className="badge bg-secondary">{post.category}</span>
                  </div>
                  <div className="col-md-6">
                    <strong>Status:</strong>{" "}
                    <span className={getStatusBadgeClass(post.status)}>
                      {post.status}
                    </span>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Posted on:</strong> {post.timestamp}
                  </div>
                  <div className="col-md-3">
                    <strong>Likes:</strong> {post.likes}
                  </div>
                  <div className="col-md-3">
                    <strong>Comments:</strong> {post.comments}
                  </div>
                </div>
                <div className="mb-3">
                  <strong>Content:</strong>
                  <div className="post-content p-3 mt-2 bg-light rounded">
                    {post.content}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  onDeletePost(post.id);
                  onClose();
                }}
              >
                <i className="fas fa-trash me-1"></i> Delete Post
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default PostModal;