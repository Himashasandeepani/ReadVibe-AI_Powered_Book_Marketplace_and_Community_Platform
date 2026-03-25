import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pages/AdminPanel.css";
import AdminHeader from "../components/common/AdminHeader";
import AdminFooter from "../components/common/AdminFooter";
import { useDispatch, useSelector } from "react-redux";

// Import Admin Components
import AdminSidebar from "../components/Admin/AdminSidebar";
import DashboardTab from "../components/Admin/DashboardTab";
import UsersTab from "../components/Admin/UsersTab";
import PostsTab from "../components/Admin/PostsTab";
import AnalyticsTab from "../components/Admin/AnalyticsTab";
import SystemTab from "../components/Admin/SystemTab";
import StatusTab from "../components/Admin/StatusTab";
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
  fetchUsersFromApi,
  createAdminUserApi,
  updateAdminUserApi,
  deleteAdminUserApi,
} from "../components/Admin/utils";
import { deleteCommunityPostApi } from "../utils/communityApi";
import {
  selectAdminUsers,
  selectAdminPosts,
  selectAdminSystemSettings,
  selectAdminStatuses,
  setAll,
  setUsers,
  setPosts,
  setSystemSettings,
  setStatuses,
} from "../store/slices/adminSlice";
import { selectCurrentUser } from "../store/slices/authSlice";

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUser);
  const users = useSelector(selectAdminUsers);
  const posts = useSelector(selectAdminPosts);
  const systemSettings = useSelector(selectAdminSystemSettings);
  const statuses = useSelector(selectAdminStatuses);

  // Extract tab from query parameters
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get("tab");
  const activeTab = tabFromQuery || "dashboard";

  // State
  const [activeUserSubTab, setActiveUserSubTab] = useState("all");

  // Modal states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.role !== "admin") {
      alert("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const pullUsers = async () => {
      if (!currentUser || currentUser.role !== "admin") return;
      try {
        const apiUsers = await fetchUsersFromApi();
        const normalized = apiUsers.map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          status: (user.status || "active").toLowerCase(),
          joinDate: user.createdAt ? user.createdAt.split("T")[0] : "",
        }));
        dispatch(setUsers(normalized));
      } catch (error) {
        console.error("Failed to load users from API", error);
      }
    };

    pullUsers();
  }, [currentUser, dispatch]);

  // Persist admin data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    saveData(users, posts, systemSettings, statuses);
  }, [users, posts, systemSettings, statuses]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleStorageChange = (event) => {
      if (
        event.key === "adminUsers" ||
        event.key === "adminCommunityPosts" ||
        event.key === "systemSettings" ||
        event.key === "adminStatuses"
      ) {
        const {
          users: storedUsers,
          posts: storedPosts,
          settings: storedSettings,
          statuses: storedStatuses,
        } = loadData();
        dispatch(
          setAll({
            users: [...storedUsers],
            posts: [...storedPosts],
            systemSettings: storedSettings,
            statuses: Array.isArray(storedStatuses) ? [...storedStatuses] : [],
          }),
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);

  const handleTabChange = (tab) => {
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
    const create = async () => {
      try {
        const newUser = await createAdminUserApi({
          username: formData.username,
          email: formData.email,
          role: formData.role,
          status: "active",
          password: formData.password,
          fullName: formData.username,
        });

        const userRecord = {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          status: (newUser.status || "active").toLowerCase(),
          joinDate: newUser.createdAt ? newUser.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
        };

        const updatedUsers = [...users, userRecord];
        dispatch(setUsers(updatedUsers));
        setShowAddUserModal(false);
        showNotification("User added successfully");
      } catch (error) {
        alert(error.message || "Failed to add user");
      }
    };

    create();
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

    const update = async () => {
      try {
        const updated = await updateAdminUserApi(editingUser.id, {
          username: formData.username,
          email: formData.email,
          role: formData.role,
          status: formData.status,
        });

        const updatedUsers = users.map((user) => {
          if (user.id === editingUser.id) {
            return {
              ...user,
              username: updated.username,
              email: updated.email,
              role: updated.role,
              status: (updated.status || formData.status).toLowerCase(),
            };
          }
          return user;
        });

        dispatch(setUsers(updatedUsers));

        setShowEditUserModal(false);
        setEditingUser(null);
        showNotification("User updated successfully");
      } catch (error) {
        alert(error.message || "Failed to update user");
      }
    };

    update();
  };

  const handleDeleteUser = (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      const remove = async () => {
        try {
          await deleteAdminUserApi(userId);
          const updatedUsers = users.filter((user) => user.id !== userId);
          dispatch(setUsers(updatedUsers));
          showNotification("User deleted successfully");
        } catch (error) {
          alert(error.message || "Failed to delete user");
        }
      };

      remove();
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
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    const performDelete = async () => {
      try {
        const actorId = currentUser?.id || currentUser?.user_id || currentUser?.userId;
        if (actorId) {
          await deleteCommunityPostApi({ userId: actorId, postId });
        }
      } catch (err) {
        console.error("Failed to delete post via API", err);
        showNotification(err.message || "Failed to delete post", "danger");
        return;
      }

      const updatedPosts = posts.filter((post) => post.id !== postId);
      dispatch(setPosts(updatedPosts));

      // Keep any legacy cache in sync
      try {
        const communityStoragePosts =
          JSON.parse(localStorage.getItem("communityPosts")) || [];
        const updatedCommunityPosts = communityStoragePosts.filter(
          (post) => post.id !== postId,
        );
        localStorage.setItem(
          "communityPosts",
          JSON.stringify(updatedCommunityPosts),
        );
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.error("Failed to sync local community cache", err);
      }

      showNotification("Post deleted successfully");
    };

    performDelete();
  };

  const handleToggleFeaturedPost = (postId) => {
    const target = posts.find((p) => p.id === postId);
    if (!target) return;

    const featuredCount = posts.filter((p) => p.featured).length;
    const willFeature = !target.featured;

    if (willFeature && featuredCount >= 2) {
      alert("Only two community posts can be featured on the home page. Unfeature another post first.");
      return;
    }

    const updated = posts.map((post) =>
      post.id === postId ? { ...post, featured: willFeature } : post,
    );
    dispatch(setPosts(updated));

    showNotification(
      willFeature
        ? "Post featured on Home"
        : "Post removed from Home",
      "success",
    );
  };

  const handleSystemSettingsChange = (key, value) => {
    dispatch(setSystemSettings({ ...systemSettings, [key]: value }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showNotification("System settings saved successfully");
  };

  const handleSaveStatus = (name, existingId = null) => {
    const trimmed = (name || "").trim();
    if (!trimmed) return;

    const prev = statuses || [];
    let next;
    if (existingId) {
      next = prev.map((s) =>
        s.id === existingId ? { ...s, status: trimmed } : s,
      );
    } else {
      const maxId = prev.length > 0 ? Math.max(...prev.map((s) => s.id || 0)) : 0;
      next = [...prev, { id: maxId + 1, status: trimmed, isActive: true }];
    }

    dispatch(setStatuses(next));
  };

  const handleDeleteStatus = (id) => {
    const next = statuses.filter((s) => s.id !== id);
    dispatch(setStatuses(next));
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
              onToggleFeatured={handleToggleFeaturedPost}
              maxFeatured={2}
              onDeletePost={handleDeletePost}
            />
          </>
        );
      case "analytics":
        return <AnalyticsTab users={users} posts={posts} />;
      case "status":
        return (
          <StatusTab
            statuses={statuses}
            onSaveStatus={handleSaveStatus}
            onDeleteStatus={handleDeleteStatus}
          />
        );
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
