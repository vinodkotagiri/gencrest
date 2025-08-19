// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
// your normal reducers
import userReducer from "./slices/userSlice";
// API slices
import { authApi } from "./api/authApi";

const store = configureStore({
  reducer: {
    user: userReducer,

    // RTK Query API slices
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export default store;
