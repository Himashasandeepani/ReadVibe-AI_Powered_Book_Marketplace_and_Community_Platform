import React, { useMemo } from "react";
import StatsCards from "./StatsCards";

const formatRelativeTime = (dateLike) => {
  if (!dateLike) return "Recently";
  const date = new Date(dateLike);
  if (isNaN(date.getTime())) return "Recently";
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const DashboardTab = ({ users, posts }) => {
  const { userStats, postStats, activity } = useMemo(() => {
    const now = new Date();
    const nowTime = now.getTime();
    const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);

    // Pull additional activity sources from localStorage (book requests, orders)
    let bookRequests = [];
    let orders = [];

    if (typeof window !== "undefined") {
      try {
        bookRequests = JSON.parse(localStorage.getItem("bookRequests")) || [];
      } catch (err) {
        console.error("Failed to read bookRequests from storage", err);
      }

      try {
        orders = JSON.parse(localStorage.getItem("stockOrders")) || [];
      } catch (err) {
        console.error("Failed to read stockOrders from storage", err);
      }
    }

    const userStats = {
      total: users.length,
      newThisMonth: users.filter((user) => {
        const joinDate = new Date(user.joinDate);
        return !isNaN(joinDate.getTime()) && joinDate >= thirtyDaysAgo;
      }).length,
    };

    const postStats = {
      total: posts.length,
      flagged: posts.filter((post) => (post.status || "").toLowerCase() === "flagged").length,
    };

    const userActivity = users
      .map((user) => ({
        user: user.username || user.email || `user_${user.id}`,
        activity: "Joined platform",
        time: formatRelativeTime(user.joinDate || user.createdAt),
        status: (user.status || "active").toLowerCase() === "active" ? "Active" : "Pending",
        timestamp: new Date(user.joinDate || user.createdAt || nowTime).getTime(),
      }));

    const postActivity = posts
      .map((post) => ({
        user: post.user || post.username || `user_${post.userId || ""}`,
        activity: "Posted in community",
        time: formatRelativeTime(post.createdAt),
        status: (post.status || "active").toLowerCase() === "flagged" ? "Flagged" : "Active",
        timestamp: new Date(post.createdAt || nowTime).getTime(),
      }));

    const requestActivity = bookRequests
      .map((req) => ({
        user: req.userName || req.userEmail || `user_${req.userId || ""}`,
        activity: req.bookTitle ? `Requested "${req.bookTitle}"` : "Requested a book",
        time: formatRelativeTime(req.dateRequested || req.date || req.createdAt),
        status: (req.status || "Pending").charAt(0).toUpperCase() + (req.status || "Pending").slice(1),
        timestamp: new Date(req.dateRequested || req.date || req.createdAt || nowTime).getTime(),
      }));

    const orderActivity = orders
      .map((order) => ({
        user: order.customerName || order.userName || order.userEmail || `user_${order.userId || ""}`,
        activity: `Order ${order.id || ""} placed`,
        time: formatRelativeTime(order.orderDate || order.createdAt),
        status: order.status || "Pending",
        timestamp: new Date(order.orderDate || order.createdAt || nowTime).getTime(),
      }));

    const combined = [...userActivity, ...postActivity, ...requestActivity, ...orderActivity]
      .filter((item) => !Number.isNaN(item.timestamp))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 8);

    return { userStats, postStats, activity: combined };
  }, [users, posts]);

  return (
    <>
      <h2 className="mb-4">Admin Dashboard</h2>

      <StatsCards userStats={userStats} postStats={postStats} />

      <div className="admin-dashboard-card">
        <h4 className="mb-4">Recent Platform Activity</h4>
        <div className="table-responsive">
          <table className="table table-hover admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Activity</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activity.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-muted text-center">
                    No recent activity yet
                  </td>
                </tr>
              )}
              {activity.map((item, index) => (
                <tr key={index}>
                  <td>{item.user}</td>
                  <td>{item.activity}</td>
                  <td>{item.time}</td>
                  <td>
                    <span
                      className={`badge bg-${item.status.toLowerCase() === "active" ? "success" : item.status.toLowerCase() === "flagged" ? "danger" : "warning"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardTab;
