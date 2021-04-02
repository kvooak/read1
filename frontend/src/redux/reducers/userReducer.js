/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {},
  error: {},
  loading: true,
};

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    GET_USER_VALUE: (state, action) => {
      Object.assign(state.value, action.payload);
      state.loading = false;
    },

    USER_PROFILE_CREATED: (state, action) => {
      Object.assign(state.value, action.payload);
    },

    EMAIL_VERIFIED: (state, action) => {
      console.log(action.payload);
      const { email_verified } = action.payload;
      state.value.emailVerified = email_verified;
    },

    SIGN_UP_FORM_VERIFICATION_CODE: (state, action) => {
      Object.assign(state.value, action.payload);
    },

    SIGN_UP_FORM_ERROR: (state, action) => {
      state.error = action.payload;
    },
  },
});

const { actions, reducer } = userSlice;

export const {
  GET_USER_VALUE,
  USER_PROFILE_CREATED,
  SIGN_UP_FORM_VERIFICATION_CODE,
  SIGN_UP_FORM_ERROR,
} = actions;

export default reducer;
