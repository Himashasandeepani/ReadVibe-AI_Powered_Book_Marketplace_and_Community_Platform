import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import adminReducer from "./slices/adminSlice";

const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    cart: cartReducer,
    admin: adminReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
