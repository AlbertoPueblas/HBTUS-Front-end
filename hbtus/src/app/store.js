import { combineReducers } from "redux";
import userSlice from "./slice/userSlice";
import appointmentSlice from "./slice/apointment";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import { configureStore } from "@reduxjs/toolkit";

//--------------------------------------------------------------

const reducers = combineReducers({
  user: userSlice,
  appointment: appointmentSlice
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});
