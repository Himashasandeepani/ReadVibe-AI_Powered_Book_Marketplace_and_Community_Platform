import React from "react";
import StatsCards from "./StatsCards";

const DashboardTab = ({ users, posts }) => {
  const userStats = {
    total: users.length,
    newThisMonth: users.filter((user) => {
      const joinDate = new Date(user.joinDate);
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      return joinDate >= thirtyDaysAgo;
    }).length,
  };

  const postStats = {
    total: posts.length,
    flagged: posts.filter((post) => post.status === "Flagged").length,
  };

  const recentActivity = [
    {
      user: "john_doe",
      activity: "Posted in community",
      time: "2 hours ago",
      status: "Active",
    },
    {
      user: "sarah_j",
      activity: "Purchased books",
      time: "4 hours ago",
      status: "Active",
    },
    {
      user: "mike_b",
      activity: "Account created",
      time: "1 day ago",
      status: "New",
    },
  ];

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
              {recentActivity.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.user}</td>
                  <td>{activity.activity}</td>
                  <td>{activity.time}</td>
                  <td>
                    <span className={`badge bg-${activity.status === "Active" ? "success" : "warning"}`}>
                      {activity.status}
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