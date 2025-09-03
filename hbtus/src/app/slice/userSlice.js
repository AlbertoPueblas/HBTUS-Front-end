import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  decoded: {
    id: "",
    userId: "",
    name: "",
    email: "",
    userRole: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token || "";
      state.decoded = action.payload.decoded || initialState.decoded;
    },
    logout: (state) => {
      state.token = "";
      state.decoded = { ...initialState.decoded };
    },
    setUserDetails: (state, action) => {
      state.decoded = action.payload;
    },
    setUser: (state, action) => {
      state.decoded.id = action.payload;
    },
    setUserId: (state, action) => {
      state.decoded.userId = action.payload;
    },
  },
});

export const { login, logout, setUserDetails, setUserId, setUser } = userSlice.actions;

export const getUserData = (state) => state.user;
export const getLoggedAmount = (state) => state.user.vecesLogeado;

export default userSlice.reducer;
