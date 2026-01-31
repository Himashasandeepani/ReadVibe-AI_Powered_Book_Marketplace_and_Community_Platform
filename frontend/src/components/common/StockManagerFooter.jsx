import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faCube, faBoxes } from "@fortawesome/free-solid-svg-icons";
import "../../styles/components/StockManagerHeaderFooter.css";

const StockManagerFooter = () => {
  return (
    <footer className="stock-manager-footer">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 d-flex align-items-center mb-3 mb-md-0">
            <FontAwesomeIcon icon={faBookOpen} className="stock-manager-footer-icon" />
            <div className="stock-manager-footer-brand">
              <div className="stock-manager-footer-name">ReadVibe</div>
              <div className="stock-manager-footer-role">Stock Manager</div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="stock-manager-footer-links">
              <div className="stock-manager-footer-link">
                <FontAwesomeIcon icon={faCube} className="me-2" />
                Inventory Operations
              </div>
              <div className="stock-manager-footer-link">
                <FontAwesomeIcon icon={faBoxes} className="me-2" />
                Warehouse Performance
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StockManagerFooter;