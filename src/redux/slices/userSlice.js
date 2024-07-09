import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    email: "",
    role: "",
  },
  reducers: {
    changeName: (state, action) => {
      state.name = action.payload;
    },
    changeEmail: (state, action) => {
      state.email = action.payload;
    },
    changeRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { changeName, changeEmail, changeRole } = userSlice.actions;
export default userSlice.reducer;
