import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faUserCog,
  faSignOutAlt,
  faHome,
  faChevronDown,
  faShieldAlt,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";
import { getCurrentUser, logout } from "../utils/auth";
import "../styles/components/StockManagerHeaderFooter.css";

const StockManagerHeader = () => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    logout();
    setExpanded(false);
    navigate("/login");
  };

  const handleGoToMainSite = () => {
    setExpanded(false);
    navigate("/");
  };

  const handleGoToStockManager = () => {
    setExpanded(false);
    navigate("/stock-manager");
  };

  return (
    <nav className="stock-manager-header navbar navbar-expand-lg">
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link
          to="/stock-manager"
          className="navbar-brand stock-manager-brand"
          onClick={() => setExpanded(false)}
        >
          <FontAwesomeIcon icon={faBookOpen} className="me-2" />
          <span className="brand-text">
            <span className="brand-main fw-bold">ReadVibe</span>
            <span className="brand-stock-manager">Stock Manager</span>
          </span>
        </Link>

        {/* stock-manager Navigation Toggle */}
        <button
          className="navbar-toggler stock-manager-toggler"
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* stock-manager Navigation */}
        <div className={`collapse navbar-collapse ${expanded ? "show" : ""}`}>
          {/* stock-manager User Dropdown */}
          <div className="d-flex align-items-center stock-manager-user-section">
            <div className="stock-manager-user-info me-3 d-none d-md-block">
              <div className="stock-manager-user-role">
                <FontAwesomeIcon icon={faShieldAlt} className="me-1" />
                <span>Stock Manager</span>
              </div>
              <div className="stock-manager-user-name">
                {user?.name || user?.username || "stock-manager"}
              </div>
            </div>

            <Dropdown className="stock-manager-dropdown">
              <Dropdown.Toggle
                variant="primary"
                id="stock-manager-dropdown-toggle"
                className="stock-manager-dropdown-toggle"
              >
                <div className="stock-manager-avatar">
                  <FontAwesomeIcon icon={faUserCog} />
                </div>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="stock-manager-dropdown-arrow"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu
                className="stock-manager-dropdown-menu"
                align="end"
              >
                <Dropdown.Header className="stock-manager-dropdown-header">
                  <div className="stock-manager-dropdown-welcome">Welcome,</div>
                  <div className="stock-manager-dropdown-user">
                    {user?.name || user?.username || "stock-manager"}
                  </div>
                  <div className="stock-manager-dropdown-role">
                    <FontAwesomeIcon icon={faShieldAlt} className="me-1" />
                    StockManager
                  </div>
                </Dropdown.Header>
                <Dropdown.Divider className="stock-manager-dropdown-divider" />

                <Dropdown.Item
                  as={Link}
                  to="/stock-manager"
                  className="stock-manager-dropdown-item"
                  onClick={handleGoToStockManager}
                >
                  <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
                  Stock Manager Dashboard
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={handleGoToMainSite}
                  className="stock-manager-dropdown-item"
                >
                  <FontAwesomeIcon icon={faHome} className="me-2" />
                  Go to Main Site
                </Dropdown.Item>

                <Dropdown.Divider className="stock-manager-dropdown-divider" />

                <Dropdown.Item
                  onClick={handleLogout}
                  className="stock-manager-dropdown-item logout-item"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StockManagerHeader;
