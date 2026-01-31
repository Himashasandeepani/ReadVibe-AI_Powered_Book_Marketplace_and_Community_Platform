import React from "react";

const AdminSidebar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "tachometer-alt" },
    { id: "users", label: "User Management", icon: "users" },
    { id: "posts", label: "Community Posts", icon: "comments" },
    { id: "analytics", label: "Analytics", icon: "chart-bar" },
    { id: "system", label: "System Settings", icon: "cog" },
  ];

  return (
    <div className="admin-sidebar">
      <h5 className="mb-4">Admin Panel</h5>
      <ul className="nav nav-pills flex-column admin-panel-nav">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              <i className={`fas fa-${tab.icon} me-2`}></i>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;