import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faInfoCircle, faBookMedical } from "@fortawesome/free-solid-svg-icons";

const RequestBookModal = ({
  show,
  onClose,
  requestForm,
  setRequestForm,
  onRequestBook,
}) => {
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({ ...prev, [name]: value }));
  };

  const categories = [
    "Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Romance",
    "Non-Fiction",
    "Biography",
    "Self-Help",
    "Other"
  ];

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">
              <FontAwesomeIcon icon={faBookMedical} className="me-2" />
              Request a New Book
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          
          <div className="modal-body">
            <form id="requestBookForm">
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Book Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter book title"
                  required
                  name="title"
                  value={requestForm.title}
                  onChange={handleChange}
                />
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Author <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Author name"
                    required
                    name="author"
                    value={requestForm.author}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    ISBN (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ISBN number"
                    name="isbn"
                    value={requestForm.isbn}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">Category</label>
                <select
                  className="form-select"
                  name="category"
                  value={requestForm.category}
                  onChange={handleChange}
                >
                  <option value="">Select category...</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Why do you want this book?{" "}
                  <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Tell us why this book would be valuable to you and other readers..."
                  required
                  maxLength="500"
                  name="reason"
                  value={requestForm.reason}
                  onChange={handleChange}
                ></textarea>
                <div className="text-end mt-1">
                  <small className="text-muted">Max 500 characters</small>
                </div>
              </div>
              
              <div className="alert alert-info">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                <small>
                  Your request will be reviewed by our stock team. You'll be
                  notified when it's available!
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
              className="btn btn-success"
              onClick={onRequestBook}
            >
              <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestBookModal;