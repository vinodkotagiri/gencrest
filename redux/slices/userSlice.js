import { createSlice } from "@reduxjs/toolkit";
import { setCookie, getCookie, clearCookie } from "../../utils/cookieHelpers";

const initialState = {
  user: getCookie("user") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      setCookie("user", action.payload, 7); // persist for 7 days
    },
    clearUser(state) {
      state.user = null;
      clearCookie("user");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
