/* eslint no-underscore-dangle: 0 */
/* eslint camelcase: 0 */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  error: null,
  loading: null,
};

const documentSlice = createSlice({
  name: 'document',
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

export default documentSlice;
