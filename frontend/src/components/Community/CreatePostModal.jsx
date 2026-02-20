import React from "react";

const CreatePostModal = ({
  showCreatePostModal,
  setShowCreatePostModal,
  postContent,
  setPostContent,
  postCategory,
  setPostCategory,
  selectedBook,
  setSelectedBook,
  handleCreatePost,
}) => {
  if (!showCreatePostModal) return null;

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Community Post</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowCreatePostModal(false)}
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
                    <option value="The Midnight Library by Matt Haig">
                      The Midnight Library by Matt Haig
                    </option>
                    <option value="Project Hail Mary by Andy Weir">
                      Project Hail Mary by Andy Weir
                    </option>
                    <option value="Dune by Frank Herbert">
                      Dune by Frank Herbert
                    </option>
                    <option value="The Hobbit by J.R.R. Tolkien">
                      The Hobbit by J.R.R. Tolkien
                    </option>
                  </select>
                </div>
              </div>
              <div className="alert alert-info">
                <i className="fas fa-lightbulb me-2"></i>
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
              onClick={() => setShowCreatePostModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCreatePost}
            >
              <i className="fas fa-paper-plane me-2"></i>Post to Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
