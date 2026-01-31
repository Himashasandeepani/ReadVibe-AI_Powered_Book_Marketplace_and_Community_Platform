import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faEnvelope,
  faPhone,
  faBuilding,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import StatusBadge from "../Common/StatusBadge";
import ActionButtons from "../Common/ActionButtons";

const SuppliersTab = ({
  suppliers,
  onAddSupplier,
  onContactSupplier,
  onDeleteSupplier
}) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Supplier Management</h2>
        <button className="btn btn-primary" onClick={onAddSupplier}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Supplier
        </button>
      </div>

      <div className="row mb-4">
        {suppliers.length === 0 ? (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No suppliers found</p>
            <button className="btn btn-primary mt-2" onClick={onAddSupplier}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add Your First Supplier
            </button>
          </div>
        ) : (
          suppliers.map((supplier) => (
            <div key={supplier.id} className="col-md-6 col-lg-4 mb-3">
              <div className="stock-manager-dashboard-card h-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">{supplier.id}</span>
                  <StatusBadge status={supplier.status} type="supplier" />
                </div>
                <h5 className="mb-3">{supplier.name}</h5>
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-1">
                    <FontAwesomeIcon
                      icon={faUserTie}
                      className="text-muted me-2"
                      size="sm"
                    />
                    <span>{supplier.contact}</span>
                  </div>
                  <div className="d-flex align-items-center mb-1">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-muted me-2"
                      size="sm"
                    />
                    <span>{supplier.email}</span>
                  </div>
                  <div className="d-flex align-items-center mb-1">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="text-muted me-2"
                      size="sm"
                    />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faBuilding}
                      className="text-muted me-2"
                      size="sm"
                    />
                    <span className="small">{supplier.address}</span>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <div className="small text-muted">Books Supplied</div>
                    <div className="fw-bold">{supplier.booksSupplied}</div>
                  </div>
                  <div className="col-6">
                    <div className="small text-muted">Lead Time</div>
                    <div className="fw-bold">{supplier.leadTime}</div>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary grow"
                    onClick={() => onContactSupplier(supplier.id)}
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="me-1" />
                    Contact
                  </button>
                  <ActionButtons
                    onDelete={() => onDeleteSupplier(supplier.id)}
                    showDelete={true}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default SuppliersTab;