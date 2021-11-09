/* eslint no-underscore-dangle: 0 */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import {
  getDocumentByID,
} from '../actions/documentActions';

const initialState = {
  identity: {},
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
          const updatedLine = {
            ...line,
            ...action.payload,
          };
          return updatedLine;
        }
        return line;
      });
      Object.assign(state.lines, updatedLines);
    },

    ADD_BLOCK: (state, action) => {
      const updatedLines = state.lines.push(action.payload);
      Object.assign(state.lines, updatedLines);
    },

    GET_BLOCKS: (state, action) => {
      Object.assign(state.lines, action.payload);
    },

    UPDATE_DOC_IDENTITY: (state, action) => {
      Object.assign(state.identity, action.payload);
    },
  },

  extraReducers: {
    [getDocumentByID.fulfilled]: (state, action) => {
      Object.assign(state.loading, false);
      if (action.payload.data._key) {
        Object.assign(state.identity, action.payload.data);
        Object.assign(state.error, false);
      } else {
        Object.assign(state.error, action.payload);
      }
    },
  },
});

export default documentSlice;
