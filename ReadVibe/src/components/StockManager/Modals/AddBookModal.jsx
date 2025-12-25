import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const AddBookModal = ({ 
  show, 
  onClose, 
  newBook, 
  onInputChange, 
  onSubmit, 
  isEditing 
}) => {
  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        tabIndex="-1"
      >
        <div className="modal-dialog stock-manager-modal modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                {isEditing ? "Edit Book" : "Add New Book"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <form id="addBookForm" onSubmit={onSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">ISBN *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter ISBN"
                      name="isbn"
                      value={newBook.isbn}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Book title"
                      name="title"
                      value={newBook.title}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Author *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Author name"
                      name="author"
                      value={newBook.author}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      name="category"
                      value={newBook.category}
                      onChange={onInputChange}
                      required
                    >
                      <option value="Fiction">Fiction</option>
                      <option value="Science Fiction">Science Fiction</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="Mystery">Mystery</option>
                      <option value="Romance">Romance</option>
                      <option value="Non-Fiction">Non-Fiction</option>
                      <option value="Biography">Biography</option>
                      <option value="Self-Help">Self-Help</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Selling Price (LKR) *</label>
                    <div className="input-group">
                      <span className="input-group-text">LKR</span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        name="price"
                        value={newBook.price}
                        onChange={onInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Cost Price (LKR)</label>
                    <div className="input-group">
                      <span className="input-group-text">LKR</span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        name="costPrice"
                        value={newBook.costPrice}
                        onChange={onInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Stock Quantity *</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      min="0"
                      name="stock"
                      value={newBook.stock}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Minimum Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="5"
                      min="0"
                      name="minStock"
                      value={newBook.minStock}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Maximum Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="100"
                      min="0"
                      name="maxStock"
                      value={newBook.maxStock}
                      onChange={onInputChange}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Book description"
                    name="description"
                    value={newBook.description}
                    onChange={onInputChange}
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Publisher</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Publisher name"
                      name="publisher"
                      value={newBook.publisher}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Publication Year</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="2024"
                      min="1900"
                      max={new Date().getFullYear()}
                      name="publicationYear"
                      value={newBook.publicationYear}
                      onChange={onInputChange}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="addBookForm"
                className="btn btn-primary"
              >
                {isEditing ? "Update Book" : "Add Book"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default AddBookModal;