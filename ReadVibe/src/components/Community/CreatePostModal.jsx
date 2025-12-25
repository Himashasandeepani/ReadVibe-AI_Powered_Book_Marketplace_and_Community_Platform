import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faLightbulb } from "@fortawesome/free-solid-svg-icons";

const CreatePostModal = ({
  show,
  onClose,
  postContent,
  setPostContent,
  postCategory,
  setPostCategory,
  selectedBook,
  setSelectedBook,
  onCreatePost,
}) => {
  if (!show) return null;

  const books = [
    "The Midnight Library by Matt Haig",
    "Project Hail Mary by Andy Weir",
    "Dune by Frank Herbert",
    "The Hobbit by J.R.R. Tolkien"
  ];

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Community Post</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form id="createPostForm">
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  What's on your mind? *
                </label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Share your thoughts about books, reading experiences, or ask for recommendations..."
                  required
                  maxLength="1000"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                ></textarea>
                <div className="text-end mt-1">
                  <small className="text-muted">Max 1000 characters</small>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Category *</label>
                  <select
                    className="form-select"
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    required
                  >
                    <option value="Discussion">Discussion</option>
                    <option value="Book Review">Book Review</option>
                    <option value="Recommendation">Recommendation</option>
                    <option value="Question">Question</option>
                    <option value="Announcement">Announcement</option>
                  </select>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Add a book reference (optional)
                  </label>
                  <select
                    className="form-select"
                    value={selectedBook}
                    onChange={(e) => setSelectedBook(e.target.value)}
                  >
                    <option value="">Select a book...</option>
                    {books.map((book, index) => (
                      <option key={index} value={book}>{book}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Add image (optional)
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                />
                <small className="text-muted">
                  Max file size: 5MB. Supported formats: JPG, PNG, GIF
                </small>
              </div>
              
              <div className="alert alert-info">
                <FontAwesomeIcon icon={faLightbulb} className="me-2" />
                <small>
                  Note: All posts will be visible to the admin for content
                  moderation. Inappropriate posts may be removed by
                  administrators.
                </small>
              </div>
            </form>
          </div>
          
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onCreatePost}
            >
              <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
              Post to Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;