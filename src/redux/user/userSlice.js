// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   loading: false,
//   user: null,
//   error: null,
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     sendUserRequest: (state) => {
//       state.loading = true;
//       state.error = null;
//     },

//     receiveUserResponse: (state, action) => {
//       state.loading = false;
//       state.user = action.payload;
//     },

//     receiveUserError: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     },
//   },
// });

// export const { sendUserRequest, receiveUserResponse, receiveUserError } =
//   userSlice.actions;

// export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  user: null,
  token: null,
  isLogin: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    sendUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    receiveUserResponse: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLogin = true;
      state.error = null;
    },

    receiveUserError: (state, action) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      // state.isLogin = false;
      state.error = action.payload;
    },

    logoutUser: (state, action) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.isLogin = false;
      state.error = action?.payload?.error || null;
    },

    setTokenFromStorage: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        state.isLogin = true;
      }
    },
    finishAuthCheck: (state) => {
      state.loading = false;
    },
  },
});

export const {
  sendUserRequest,
  receiveUserResponse,
  receiveUserError,
  logoutUser,
  setTokenFromStorage,
  finishAuthCheck,
} = userSlice.actions;

export default userSlice.reducer;
