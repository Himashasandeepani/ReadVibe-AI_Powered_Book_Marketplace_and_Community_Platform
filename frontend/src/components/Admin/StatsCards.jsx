import React from "react";

const StatsCards = ({ userStats, postStats }) => {
  const stats = [
    {
      number: userStats.total,
      label: "Total Users",
      icon: "users",
      color: "primary",
    },
    {
      number: userStats.newThisMonth,
      label: "New This Month",
      icon: "user-plus",
      color: "success",
    },
    {
      number: postStats.total,
      label: "Active Posts",
      icon: "comments",
      color: "info",
    },
    {
      number: postStats.flagged,
      label: "Flagged Content",
      icon: "flag",
      color: "warning",
    },
  ];

  return (
    <div className="row">
      {stats.map((stat, index) => (
        <div className="col-md-3 mb-4" key={index}>
          <div className="stats-card">
            <div className="stats-number">{stat.number}</div>
            <div className="stats-label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
