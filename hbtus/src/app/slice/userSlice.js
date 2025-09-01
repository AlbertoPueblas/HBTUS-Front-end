import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  decodificado: {
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
      state.decodificado = action.payload.decodificado || initialState.decodificado;
    },
    logout: (state) => {
      state.token = "";
      state.decodificado = { ...initialState.decodificado };
    },
    setUserDetails: (state, action) => {
      state.decodificado = action.payload;
    },
    setUser: (state, action) => {
      state.decodificado.id = action.payload;
    },
    setUserId: (state, action) => {
      state.decodificado.userId = action.payload;
    },
  },
});

export const { login, logout, setUserDetails, setUserId, setUser } = userSlice.actions;

export const getUserData = (state) => state.user;
export const getLoggedAmount = (state) => state.user.vecesLogeado;

export default userSlice.reducer;
