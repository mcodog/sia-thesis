import { configureStore } from "@reduxjs/toolkit";
import quizResultReducer from "./counterSlice";
import settingsReducer from "./settingsSlice";

export const store = configureStore({
  reducer: {
    quizResult: quizResultReducer,
    settings: settingsReducer,
  },
});
