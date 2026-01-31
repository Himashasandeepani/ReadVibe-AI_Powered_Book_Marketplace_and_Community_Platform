import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faShieldAlt,
  faCode,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/components/StockManagerHeaderFooter.css";

const StockManagerFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="stock-manager-footer">
      <div className="container-fluid">
        <div className="stock-manager-footer-content">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="stock-manager-footer-brand">
                <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                <h5 className="d-inline">
                  <span className="brand-main">ReadVibe</span>
                  <span className="brand-stock-manager">Stock Manager</span>
                </h5>
              </div>
              <p className="stock-manager-footer-description">
                Advanced inventory management and order processing system for
                ReadVibe bookstore. Manage stock levels, suppliers, and fulfill
                customer orders efficiently.
              </p>
              <div className="stock-manager-footer-security">
                <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                <span>Secure Stock Manager Portal</span>
              </div>
            </div>

            <div className="col-lg-2 col-md-3 mb-4">
              <h6 className="stock-manager-footer-heading">Quick Links</h6>
              <ul className="stock-manager-footer-links">
                <li>
                  <Link
                    to="/stock-manager"
                    className="stock-manager-footer-link"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/stock-manager?tab=users"
                    className="stock-manager-footer-link"
                  >
                    Inventory
                  </Link>
                </li>
                <li>
                  <Link
                    to="/stock-manager?tab=posts"
                    className="stock-manager-footer-link"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/stock-manager?tab=analytics"
                    className="stock-manager-footer-link"
                  >
                    Suppliers
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-3 mb-4">
              <h6 className="stock-manager-footer-heading">Reports</h6>
              <ul className="stock-manager-footer-links">
                <li>
                  <Link
                    to="/stock-manager?tab=system"
                    className="stock-manager-footer-link"
                  >
                    Stock Reports
                  </Link>
                </li>
                <li>
                  <a href="#" className="stock-manager-footer-link">
                    Book Requests
                  </a>
                </li>
                <li>
                  <a href="#" className="stock-manager-footer-link">
                    Sales Analytics
                  </a>
                </li>
                <li>
                  <a href="#" className="stock-manager-footer-link">
                    Supplier Performance
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <h6 className="stock-manager-footer-heading">System Status</h6>
              <div className="stock-manager-system-status">
                <div className="status-item">
                  <span className="status-label">Platform:</span>
                  <span className="status-value status-active">
                    Operational
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Database:</span>
                  <span className="status-value status-active">Connected</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Order Processing:</span>
                  <span className="status-value">Online</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Inventory System:</span>
                  <span className="status-value">Online</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="stock-manager-footer-divider" />

          <div className="stock-manager-footer-bottom">
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="stock-manager-copyright">
                  &copy; {currentYear} ReadVibe Stock Management. All rights
                  reserved.
                </p>
              </div>
              <div className="col-md-6">
                <div className="stock-manager-footer-info">
                  <div className="stock-manager-developer-info">
                    <FontAwesomeIcon icon={faCode} className="me-1" />
                    <span>ReadVibe Stock Management System v2.1.0</span>
                  </div>
                  <div className="stock-manager-legal-links">
                    <Link
                      to="/privacy-policy"
                      className="stock-manager-legal-link"
                    >
                      Privacy
                    </Link>
                    <span className="separator">•</span>
                    <Link to="/terms" className="stock-manager-legal-link">
                      Terms
                    </Link>
                    <span className="separator">•</span>
                    <span className="stock-manager-made-with">
                      <FontAwesomeIcon icon={faHeart} className="me-1" />
                      Made for ReadVibe
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StockManagerFooter;
