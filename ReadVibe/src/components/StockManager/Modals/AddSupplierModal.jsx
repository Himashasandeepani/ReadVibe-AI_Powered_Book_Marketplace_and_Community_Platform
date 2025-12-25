import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const AddSupplierModal = ({ 
  show, 
  onClose, 
  newSupplier, 
  onInputChange, 
  onSubmit 
}) => {
  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        tabIndex="-1"
      >
        <div className="modal-dialog stock-manager-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add New Supplier
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <form id="addSupplierForm" onSubmit={onSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Supplier Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter supplier name"
                      name="name"
                      value={newSupplier.name}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Contact Person *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contact person name"
                      name="contact"
                      value={newSupplier.contact}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email address"
                      name="email"
                      value={newSupplier.email}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+94 XX XXX XXXX"
                      name="phone"
                      value={newSupplier.phone}
                      onChange={onInputChange}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Supplier address"
                    name="address"
                    value={newSupplier.address}
                    onChange={onInputChange}
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Website</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://example.com"
                      name="website"
                      value={newSupplier.website}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Rating (1-5)</label>
                    <select
                      className="form-select"
                      name="rating"
                      value={newSupplier.rating}
                      onChange={onInputChange}
                    >
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Payment Terms</label>
                    <select
                      className="form-select"
                      name="paymentTerms"
                      value={newSupplier.paymentTerms}
                      onChange={onInputChange}
                    >
                      <option value="15 days">15 days</option>
                      <option value="30 days">30 days</option>
                      <option value="45 days">45 days</option>
                      <option value="60 days">60 days</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Lead Time (days)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="7"
                      name="leadTime"
                      value={newSupplier.leadTime}
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
                form="addSupplierForm"
                className="btn btn-primary"
              >
                Add Supplier
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default AddSupplierModal;