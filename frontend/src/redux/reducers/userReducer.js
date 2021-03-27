/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {},
  error: {},
};

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    GET_USER_VALUE: (state, action) => {
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
  SIGN_UP_FORM_ERROR,
} = actions;

export default reducer;
