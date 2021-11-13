/* eslint no-underscore-dangle: 0 */
/* eslint camelcase: 0 */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

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
    GET_DOC_BY_ID: (state, action) => {
      Object.assign(state, {
        ...state,
        identity: action.payload,
        error: false,
        loading: false,
      });
    },

    BLOCK_ERROR: (state, action) => {
      Object.assign(state.error, action.payload);
    },

    UPDATE_BLOCK: (state, action) => {
      const updatedBlocks = state.lines.map((block) => {
        if (block.id === action.payload.id) {
          const updatedBlock = {
            ...block,
            ...action.payload,
          };
          return updatedBlock;
        }
        return block;
      });
      Object.assign(state.lines, updatedBlocks);
    },

    DESTROY_BLOCK: (state, action) => {
      const deleted_id = action.payload;
      const updatedContent = state.identity.content.filter((id) => id !== deleted_id);
      const updatedLines = state.lines.filter((line) => line.id !== deleted_id);

      Object.assign(state, {
        ...state,
        identity: {
          ...state.identity,
          content: updatedContent,
        },
        lines: updatedLines,
      });
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
});

export default documentSlice;
