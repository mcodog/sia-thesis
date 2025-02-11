import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  name: "",
  email: "",
  firstName: "",
  lastName: "",
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleLogin: (state, action) => {
      state.isLoggedIn = !state.isLoggedIn;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setFirstName: (state, action) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action) => {
      state.lastName = action.payload;
    },
    triggerLogout: () => initialState,
  },
});

export const {
  toggleLogin,
  setToken,
  setName,
  setEmail,
  setFirstName,
  setLastName,
  triggerLogout,
} = authSlice.actions;
export default authSlice.reducer;
