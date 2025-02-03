import { configureStore } from "@reduxjs/toolkit";
import quizResultReducer from "./counterSlice";

export const store = configureStore({
  reducer: {
    quizResult: quizResultReducer,
  },
});
