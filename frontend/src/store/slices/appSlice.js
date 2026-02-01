import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  initialized: true,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // placeholder reducer; add real reducers as needed
    setInitialized: (state, action) => {
      state.initialized = action.payload;
    },
  },
});

export const { setInitialized } = appSlice.actions;
export default appSlice.reducer;
