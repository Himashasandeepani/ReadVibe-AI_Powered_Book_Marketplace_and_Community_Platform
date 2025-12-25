import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pages/AdminPanel.css";
import AdminHeader from "../components/AdminHeader";
import AdminFooter from "../components/AdminFooter";

// Import Admin Components
import AdminSidebar from "../components/Admin/AdminSidebar";
import DashboardTab from "../components/Admin/DashboardTab";
import UsersTab from "../components/Admin/UsersTab";
import PostsTab from "../components/Admin/PostsTab";
import AnalyticsTab from "../components/Admin/AnalyticsTab";
import SystemTab from "../components/Admin/SystemTab";
import UserTable from "../components/Admin/UserTable";
import PostsTable from "../components/Admin/PostsTable";
import AddUserModal from "../components/Admin/AddUserModal";
import EditUserModal from "../components/Admin/EditUserModal";
import PostModal from "../components/Admin/PostModal";

// Import Utilities
import {
  loadData,
  saveData,
  validateNewUser,
  validateEditUser,
  showNotification,
} from "../components/Admin/utils";

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract tab from query parameters
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get("tab");

  // State
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState(tabFromQuery || "dashboard");
  const [activeUserSubTab, setActiveUserSubTab] = useState("all");
  
  // Data state
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [systemSettings, setSystemSettings] = useState({
    platformName: "ReadVibe",
    maintenanceMode: "Disabled",
    emailNotifications: true,
  });

  // Modal states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  // New user form
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "user",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Check if user is logged in and has admin privileges
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      alert("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }

    setCurrentUser(user);

    // Load data
    const { users: loadedUsers, posts: loadedPosts, settings: loadedSettings } = loadData();
    setUsers(loadedUsers);
    setPosts(loadedPosts);
    setSystemSettings(loadedSettings);
  }, [navigate]);

  useEffect(() => {
    if (tabFromQuery) {
      setActiveTab(tabFromQuery);
    }
  }, [tabFromQuery]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`${location.pathname}?tab=${tab}`);
    if (tab === "users") {
      setActiveUserSubTab("all");
    }
  };

  const handleAddUserSubmit = (formData) => {
    const errors = validateNewUser(formData, users);
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    const newUserObj = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      username: formData.username,
      email: formData.email,
      role: formData.role,
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
    };

    const updatedUsers = [...users, newUserObj];
    setUsers(updatedUsers);
    saveData(updatedUsers, null, null);

    setShowAddUserModal(false);
    setNewUser({
      username: "",
      email: "",
      role: "user",
      password: "",
      confirmPassword: "",
    });

    showNotification("User added successfully");
  };

  const handleEditUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setEditingUser(user);
      setShowEditUserModal(true);
    }
  };

  const handleUpdateUserSubmit = (formData) => {
    if (!editingUser) return;

    const errors = validateEditUser(formData, editingUser, users);
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    const updatedUsers = users.map((user) => {
      if (user.id === editingUser.id) {
        return {
          ...user,
          username: formData.username,
          email: formData.email,
          role: formData.role,
          status: formData.status,
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    saveData(updatedUsers, null, null);

    setShowEditUserModal(false);
    setEditingUser(null);
    showNotification("User updated successfully");
  };

  const handleDeleteUser = (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
      saveData(updatedUsers, null, null);
      showNotification("User deleted successfully");
    }
  };

  const handleViewPost = (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setShowPostModal(true);
    }
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
      saveData(null, updatedPosts, null);

      // Also delete from community storage
      const communityStoragePosts =
        JSON.parse(localStorage.getItem("communityPosts")) || [];
      const updatedCommunityPosts = communityStoragePosts.filter(
        (post) => post.id !== postId
      );
      localStorage.setItem(
        "communityPosts",
        JSON.stringify(updatedCommunityPosts)
      );

      showNotification("Post deleted successfully");
    }
  };

  const handleSystemSettingsChange = (key, value) => {
    setSystemSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    saveData(null, null, systemSettings);
    showNotification("System settings saved successfully");
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab users={users} posts={posts} />;
      case "users":
        return (
          <>
            <UsersTab
              users={users}
              activeUserSubTab={activeUserSubTab}
              onSetActiveUserSubTab={setActiveUserSubTab}
              onShowAddUserModal={() => setShowAddUserModal(true)}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
            <UserTable
              users={users}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              activeUserSubTab={activeUserSubTab}
            />
          </>
        );
      case "posts":
        return (
          <>
            <PostsTab />
            <PostsTable
              posts={posts}
              onViewPost={handleViewPost}
              onDeletePost={handleDeletePost}
            />
          </>
        );
      case "analytics":
        return <AnalyticsTab users={users} posts={posts} />;
      case "system":
        return (
          <SystemTab
            systemSettings={systemSettings}
            onSystemSettingsChange={handleSystemSettingsChange}
            onSaveSettings={handleSaveSettings}
          />
        );
      default:
        return <DashboardTab users={users} posts={posts} />;
    }
  };

  if (!currentUser) {
    return (
      <div className="admin-panel">
        <AdminHeader />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading admin panel...</span>
          </div>
          <p className="mt-3">Loading admin panel...</p>
        </div>
        <AdminFooter />
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <AdminHeader />

      <div className="container-fluid mt-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-2">
            <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          {/* Main Content */}
          <div className="col-lg-10">
            <div className="tab-content">{renderActiveTab()}</div>
          </div>
        </div>
      </div>

      <AdminFooter />

      {/* Modals */}
      <AddUserModal
        show={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUserSubmit}
      />

      <EditUserModal
        show={showEditUserModal}
        onClose={() => {
          setShowEditUserModal(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSubmit={handleUpdateUserSubmit}
      />

      <PostModal
        show={showPostModal}
        onClose={() => {
          setShowPostModal(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
        onDeletePost={handleDeletePost}
      />
    </div>
  );
};

export default AdminPanel;