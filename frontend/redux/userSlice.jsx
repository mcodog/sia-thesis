import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    name: "",
    email: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setName: (state, action) => {
      state.user.name = action.payload;
    },
    setEmail: (state, action) => {
      state.user.email = action.payload;
    },
  },
});

export const { setName, setEmail } = userSlice.actions;
export default userSlice.reducer;
