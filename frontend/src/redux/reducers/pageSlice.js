/* eslint no-underscore-dangle: 0 */
/* eslint camelcase: 0 */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  error: null,
  loading: null,
};

const pageSlice = createSlice({
  name: 'page',
  initialState,

  reducers: {
    GET_DOC_BY_ID: (state, action) => {
      Object.assign(state, {
        data: action.payload,
        error: false,
        loading: false,
      });
    },
  },
});

export default pageSlice;
