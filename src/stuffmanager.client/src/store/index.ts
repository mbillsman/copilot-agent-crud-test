import { configureStore } from "@reduxjs/toolkit";
import stuffReducer from "./slices/stuffSlice";

export const store = configureStore({
  reducer: {
    stuff: stuffReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
