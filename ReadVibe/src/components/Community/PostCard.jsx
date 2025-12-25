import React from "react";
import CommentSection from "./CommentSection";
import { getUserAvatar, getUserName, formatTimestamp } from "./utils";

const PostCard = ({
  post,
  currentUser,
  onLikePost,
  onToggleComments,
  onSharePost,
  expandedComments,
  commentInputs,
  onCommentChange,
  onAddComment,
  formatTimestamp,
}) => {
  return (
    <div className="community-card" key={post.id} data-post-id={post.id}>
      <div className="d-flex align-items-center mb-3">
        <div className="user-avatar">{getUserAvatar(post)}</div>
        <div>
          <h6 className="mb-0">
            {getUserName(post)}
            {post.category && (
              <span
                className="badge bg-secondary ms-2"
                style={{ fontSize: "0.7rem" }}
              >
                {post.category}
              </span>
            )}
          </h6>
          <small className="text-muted post-meta">
            {formatTimestamp(post.timestamp)}
          </small>
        </div>
      </div>
      
      <p>{post.content}</p>
      
      {post.image && post.image.trim() !== "" && (
        <div className="mb-3">
          <img
            src={post.image}
            className="img-fluid rounded post-image"
            alt="Post"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      )}
      
      {post.bookReference && (
        <div className="book-reference">
          <i className="fas fa-book me-2"></i>
          <small>Referenced book: {post.bookReference}</small>
        </div>
      )}
      
      <div className="d-flex">
        <button
          className={`btn btn-sm btn-outline-secondary me-2 like-btn ${
            currentUser &&
            post.likedBy &&
            post.likedBy.includes(currentUser.id)
              ? "active"
              : ""
          }`}
          onClick={() => onLikePost(post.id)}
          disabled={!currentUser}
          title={!currentUser ? "Login to like posts" : ""}
        >
          <i className="far fa-thumbs-up"></i>{" "}
          <span>{post.likes || 0}</span>
        </button>
        
        <button
          className="btn btn-sm btn-outline-secondary me-2 comment-btn"
          onClick={() => onToggleComments(post.id)}
        >
          <i className="far fa-comment"></i>{" "}
          <span>{post.comments || 0}</span>
        </button>
        
        <button
          className="btn btn-sm btn-outline-secondary share-btn"
          onClick={() => onSharePost(post.id)}
        >
          <i className="far fa-share-square"></i> Share
        </button>
      </div>

      {/* Comments Section */}
      {expandedComments[post.id] && (
        <CommentSection
          post={post}
          currentUser={currentUser}
          commentInputs={commentInputs}
          onCommentChange={onCommentChange}
          onAddComment={onAddComment}
        />
      )}
    </div>
  );
};

export default PostCard;