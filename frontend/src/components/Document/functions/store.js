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

const fetchBlocks = (data) => ({
  type: 'fetchBlocks',
  payload: data,
});

const addBlock = (data) => ({
  type: 'addBlock',
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

    case 'fetchBlocks':
      return {
        ...state,
        blocks: action.payload,
      };

    case 'addBlock':
      return state;

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
    fetchBlocks,
    addBlock,
    setBlock,
    error,
  },
};

export default store;
