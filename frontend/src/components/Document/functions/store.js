/* eslint no-case-declarations: 0 */
const initialState = {
  page: null,
  blocks: [],
  error: null,
};

const error = (data) => ({
  type: 'error',
  payload: data,
});

const fetchPage = (data) => ({
  type: 'fetchPage',
  payload: data,
});

const blocksFetched = (data) => ({
  type: 'blocksFetched',
  payload: data,
});

const blockState = (data) => ({
  type: 'blockState',
  payload: data,
});

const setBlock = (data) => ({
  type: 'setBlock',
  payload: data,
});

const reducer = (state, action) => {
  const newState = { ...state };

  switch (action.type) {
    case 'fetchPage':
      return {
        ...state,
        page: action.payload[0],
      };

    case 'blocksFetched':
      newState.blocks = action.payload;
      return newState;

    case 'blockState':
      const { status, data } = action.payload;
      if (status === 'new') {
        newState.blocks = [...state.blocks, data.args];
        newState.page.content = [...state.page.content, data.id];
      } else if (status === 'killed') {
        const blockID = data.pointer.id;
        newState.blocks = state.blocks.filter((block) => block.id !== blockID);
        newState.page.content = state.page.content.filter((id) => id !== blockID);
      }
      return newState;

    case 'setBlock':
      return state;

    case 'error':
      return {
        ...state,
        error: action.payload,
      };

    default:
      throw new Error(`undefined action: ${action.type}`);
  }
};

const storeSeed = [reducer, initialState];

const store = {
  storeSeed,
  actions: {
    fetchPage,
    blocksFetched,
    blockState,
    setBlock,
    error,
  },
};

export default store;
