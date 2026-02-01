import { createSlice } from "@reduxjs/toolkit";

const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.warn("Failed to parse stored user", err);
    return null;
  }
};

const saveUser = (user) => {
  try {
    window.localStorage.setItem("currentUser", JSON.stringify(user));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.warn("Failed to persist user", err);
  }
};

const clearUser = () => {
  try {
    window.localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.warn("Failed to clear user", err);
  }
};

const initialUser = getStoredUser();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    isAuthenticated: !!initialUser,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      saveUser(action.payload);
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      clearUser();
    },
    updateUserProfile: (state, action) => {
      state.user = { ...(state.user || {}), ...action.payload };
      if (state.user) {
        saveUser(state.user);
      }
    },
  },
});

export const { loginSuccess, logoutSuccess, updateUserProfile } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
