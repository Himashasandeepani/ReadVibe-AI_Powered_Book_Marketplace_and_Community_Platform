import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";

const AddBookModal = ({ 
  show, 
  onClose, 
  newBook, 
  onInputChange, 
  onSubmit, 
  isEditing,
  categories = [],
  onManageCategories,
  authors = [],
  publishers = [],
  onNewAuthor = () => {},
  onEditAuthor = () => {},
  onDeleteAuthor = () => {}
}) => {
  if (!show) return null;

  const [showAuthorsPanel, setShowAuthorsPanel] = useState(false);
  const [showNewAuthorForm, setShowNewAuthorForm] = useState(false);
  const [newAuthorFirst, setNewAuthorFirst] = useState("");
  const [newAuthorLast, setNewAuthorLast] = useState("");
  const [localAuthors, setLocalAuthors] = useState(authors || []);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryInput, setCategoryInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const resolved = Array.isArray(authors) ? authors : [];
    setLocalAuthors(resolved);
    setSelectedAuthor(null);
  }, [Array.isArray(authors) ? authors.length : 0]);

  const handleAddAuthor = () => {
    const first = newAuthorFirst.trim();
    const last = newAuthorLast.trim();
    if (!first && !last) return;

    const payload = {
      id: Date.now(),
      firstName: first,
      lastName: last,
      name: `${first}${first && last ? " " : ""}${last}`.trim(),
    };

    onNewAuthor(payload);
    setLocalAuthors((prev) => [...prev, payload]);
    setSelectedAuthor(payload);
    setShowNewAuthorForm(false);
    setNewAuthorFirst("");
    setNewAuthorLast("");
    setShowAuthorsPanel(true);
  };

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
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        type="text"
                        className="form-control grow"
                        placeholder="Author name"
                        name="author"
                        value={newBook.author}
                        onChange={onInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        aria-label="Search authors"
                        onClick={() => setShowAuthorsPanel(true)}
                        title="Search authors"
                      >
                        <FontAwesomeIcon icon={faSearch} />
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Category *</label>
                    <div className="d-flex gap-2">
                      <select
                        className="form-select grow"
                        name="category"
                        value={newBook.category}
                        onChange={onInputChange}
                        required
                      >
                        {(categories.length ? categories : ["Fiction"]).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ minWidth: "90px" }}
                        onClick={() => {
                          setSelectedCategory(null);
                          setCategoryInput("");
                          setShowCategoryModal(true);
                        }}
                      >
                        New
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Selling Price (LKR) *</label>
                    <div className="input-group">
                      <span className="input-group-text">LKR</span>
                      <input
                        type="number"
                        className="form-control text-end"
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
                        className="form-control text-end"
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
                {/* <div className="row">
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
                </div>*/}
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
                    <select
                      className="form-select"
                      name="publisher"
                      value={newBook.publisher}
                      onChange={onInputChange}
                    >
                      <option value="">Select publisher</option>
                      {(Array.isArray(publishers) ? publishers : []).map((publisher) => (
                        <option key={publisher.id || publisher.name || publisher} value={publisher.name || publisher}>
                          {publisher.name || publisher}
                        </option>
                      ))}
                    </select>
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

      {showNewAuthorForm && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1080 }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header py-2">
                  <h6 className="modal-title mb-0">New Author</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowNewAuthorForm(false);
                      setNewAuthorFirst("");
                      setNewAuthorLast("");
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">First name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First name"
                      value={newAuthorFirst}
                      onChange={(e) => setNewAuthorFirst(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last name"
                      value={newAuthorLast}
                      onChange={(e) => setNewAuthorLast(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer py-2">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setShowNewAuthorForm(false);
                      setNewAuthorFirst("");
                      setNewAuthorLast("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleAddAuthor}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1075 }}></div>
        </>
      )}

      {showCategoryModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.45)", zIndex: 1080 }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header py-2 d-flex align-items-center">
                  <h6 className="modal-title mb-0">Manage Categories</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowCategoryModal(false);
                      setCategoryInput("");
                      setSelectedCategory(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body" style={{ maxHeight: "420px", overflowY: "auto" }}>
                  <div className="mb-3">
                    <label className="form-label">Category name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Thriller"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                    />
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover table-sm align-middle mb-0">
                      <thead style={{ backgroundColor: "#0d6efd", color: "#ffffff" }}>
                        <tr>
                          <th className="ps-3">Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(Array.isArray(categories) ? categories : []).map((cat) => (
                          <tr
                            key={cat}
                            className={selectedCategory === cat ? "table-primary" : ""}
                            role="button"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setCategoryInput(cat);
                            }}
                          >
                            <td className="small py-2">{cat}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer py-2 d-flex justify-content-between">
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setShowCategoryModal(false);
                        setCategoryInput("");
                        setSelectedCategory(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        if (!categoryInput.trim()) return;
                        onSaveCategory(categoryInput.trim(), selectedCategory || null);
                        onInputChange({ target: { name: "category", value: categoryInput.trim() } });
                        setSelectedCategory(categoryInput.trim());
                        setShowCategoryModal(false);
                        setCategoryInput("");
                      }}
                    >
                      Save
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    disabled={!selectedCategory}
                    onClick={() => {
                      if (!selectedCategory) return;
                      onDeleteCategory(selectedCategory);
                      setCategoryInput("");
                      setSelectedCategory(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1075 }}></div>
        </>
      )}

      {showAuthorsPanel && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.35)", zIndex: 1070 }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header py-2 d-flex align-items-center">
                  <h6 className="modal-title mb-0">Authors</h6>
                  <div className="ms-auto d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setShowNewAuthorForm(true)}
                    >
                      New
                    </button>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowAuthorsPanel(false)}
                    ></button>
                  </div>
                </div>
                <div className="modal-body" style={{ maxHeight: "320px", overflowY: "auto" }}>
                  {localAuthors.length === 0 ? (
                    <div className="text-muted small">No authors available.</div>
                  ) : (
                    localAuthors.map((author) => (
                      <div
                        key={author.id || author}
                        className={`d-flex justify-content-between align-items-center py-2 border-bottom ${selectedAuthor && (selectedAuthor.id === (author.id || author) || selectedAuthor === author) ? "bg-light" : ""}`}
                        role="button"
                        onClick={() => setSelectedAuthor(author)}
                      >
                        <span>{author.name || author}</span>
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => onEditAuthor(author)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => onDeleteAuthor(author)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="modal-footer py-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    disabled={!selectedAuthor}
                    onClick={() => selectedAuthor && onEditAuthor(selectedAuthor)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    disabled={!selectedAuthor}
                    onClick={() => selectedAuthor && onDeleteAuthor(selectedAuthor)}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowAuthorsPanel(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1065 }}></div>
        </>
      )}
    </>
  );
};

export default AddBookModal;