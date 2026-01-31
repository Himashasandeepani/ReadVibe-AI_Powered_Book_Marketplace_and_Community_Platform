import React from "react";
import { getRoleBadgeClass, getStatusBadgeClass } from "./utils";

const UserTable = ({ users, onEditUser, onDeleteUser, activeUserSubTab }) => {
  const filteredUsers = () => {
    switch (activeUserSubTab) {
      case "all":
        return users;
      case "users":
        return users.filter((user) => user.role === "user");
      case "admins":
        return users.filter((user) => user.role === "admin");
      case "stock":
        return users.filter((user) => user.role === "stock");
      default:
        return users;
    }
  };

  return (
    <div className="admin-dashboard-card">
      <div className="table-responsive">
        <table className="table table-hover admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers().map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span className={getRoleBadgeClass(user.role)}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={getStatusBadgeClass(user.status)}>
                    {user.status}
                  </span>
                </td>
                <td>{user.joinDate}</td>
                <td>
                  <div className="admin-action-buttons">
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => onEditUser(user.id)}
                    >
                      <i className="fas fa-edit me-1"></i>Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDeleteUser(user.id)}
                    >
                      <i className="fas fa-trash me-1"></i>Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;