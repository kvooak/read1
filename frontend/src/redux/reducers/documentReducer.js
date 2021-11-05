/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lines: [],
  error: {},
  loading: false,
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    UPDATE_LINE: (state, action) => {
      const updated_lines = state.lines.map((line) => (
        line.id === action.payload.id ? action.payload : line));

      Object.assign(state.lines, updated_lines);
    },
  },
});

const { actions, reducer } = documentSlice;

export const {
  UPDATE_LINE,
} = actions;

export default reducer;
