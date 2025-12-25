import React from "react";
import { getUserAvatar, getUserName, formatTimestamp } from "./utils";

const CommentSection = ({
  post,
  currentUser,
  commentInputs,
  onCommentChange,
  onAddComment,
}) => {
  return (
    <div className="mt-3">
      <div className="comments-section" id={`commentsList${post.id}`}>
        {!post.commentsList || post.commentsList.length === 0 ? (
          <div className="text-center py-3">
            <p className="text-muted mb-0">
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          post.commentsList.map((comment, index) => (
            <div className="comment-item" key={index}>
              <div className="d-flex">
                <div className="comment-avatar">
                  {getUserAvatar(comment)}
                </div>
                <div>
                  <h6 className="mb-0" style={{ fontSize: "0.95rem" }}>
                    {getUserName(comment)}
                  </h6>
                  <small className="text-muted">
                    {formatTimestamp(comment.timestamp)}
                  </small>
                  <p className="mb-0 mt-1">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="comment-input-group input-group">
        <input
          type="text"
          className="form-control comment-input"
          placeholder="Add a comment..."
          value={commentInputs[post.id] || ""}
          onChange={(e) => onCommentChange(post.id, e.target.value)}
          disabled={!currentUser}
          onKeyPress={(e) => e.key === "Enter" && onAddComment(post.id)}
        />
        <button
          className="btn btn-outline-primary"
          onClick={() => onAddComment(post.id)}
          disabled={!currentUser}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentSection;