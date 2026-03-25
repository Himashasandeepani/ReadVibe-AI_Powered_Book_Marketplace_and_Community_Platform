import { createSlice } from "@reduxjs/toolkit";
import {
  loadData,
  initialSystemSettings,
  initialStatuses,
} from "../../components/Admin/utils";

const buildInitialState = () => {
  const fallback = {
    users: [],
    posts: [],
    systemSettings: initialSystemSettings,
    statuses: initialStatuses,
    loading: false,
  };

  if (typeof window === "undefined") return fallback;

  try {
    const { users, posts, settings, statuses } = loadData();
    return {
      users: users || [],
      posts: posts || [],
      systemSettings: settings || initialSystemSettings,
      statuses: Array.isArray(statuses) ? statuses : initialStatuses,
      loading: false,
    };
  } catch (err) {
    console.warn("Failed to load admin state from storage", err);
    return fallback;
  }
};

const adminSlice = createSlice({
  name: "admin",
  initialState: buildInitialState(),
  reducers: {
    setAll(state, action) {
      const { users, posts, systemSettings, statuses } = action.payload || {};
      if (users) state.users = users;
      if (posts) state.posts = posts;
      if (systemSettings) state.systemSettings = systemSettings;
      if (statuses) state.statuses = statuses;
    },
    setUsers(state, action) {
      state.users = action.payload || [];
    },
    upsertUser(state, action) {
      const user = action.payload;
      if (!user) return;
      const idx = state.users.findIndex((u) => u.id === user.id);
      if (idx >= 0) {
        state.users[idx] = user;
      } else {
        state.users.push(user);
      }
    },
    removeUser(state, action) {
      const id = action.payload;
      state.users = state.users.filter((u) => u.id !== id);
    },
    setPosts(state, action) {
      state.posts = action.payload || [];
    },
    upsertPost(state, action) {
      const post = action.payload;
      if (!post) return;
      const idx = state.posts.findIndex((p) => p.id === post.id);
      if (idx >= 0) {
        state.posts[idx] = post;
      } else {
        state.posts.push(post);
      }
    },
    removePost(state, action) {
      const id = action.payload;
      state.posts = state.posts.filter((p) => p.id !== id);
    },
    setSystemSettings(state, action) {
      state.systemSettings = action.payload || initialSystemSettings;
    },
    setStatuses(state, action) {
      state.statuses = action.payload || initialStatuses;
    },
    setLoading(state, action) {
      state.loading = Boolean(action.payload);
    },
  },
});

export const {
  setAll,
  setUsers,
  upsertUser,
  removeUser,
  setPosts,
  upsertPost,
  removePost,
  setSystemSettings,
  setStatuses,
  setLoading,
} = adminSlice.actions;

export const selectAdminUsers = (state) => state.admin.users;
export const selectAdminPosts = (state) => state.admin.posts;
export const selectAdminSystemSettings = (state) => state.admin.systemSettings;
export const selectAdminStatuses = (state) => state.admin.statuses;
export const selectAdminLoading = (state) => state.admin.loading;

export default adminSlice.reducer;
