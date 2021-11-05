/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

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
      const updatedLines = state.lines.map((line) => {
        if (line.id === action.payload.id) {
          return action.payload;
        }
        return line;
      });
      Object.assign(state.lines, updatedLines);
    },

    ADD_BLANK_LINE: (state) => {
      const blankLine = () => ({
        id: uuidv4(),
        left: '',
        right: '',
      });
      const updatedLines = state.lines.push(blankLine());
      Object.assign(state.lines, updatedLines);
    },
  },
});

export default documentSlice;
