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

const newBlock = (data) => ({
  type: 'newBlock',
  payload: data,
});

const setBlock = (data) => ({
  type: 'setBlock',
  payload: data,
});

const reducer = (state, action) => {
  const newState = { ...state };

  let newBlockData;
  switch (action.type) {
    case 'fetchPage':
      return {
        ...state,
        page: action.payload[0],
      };

    case 'blocksFetched':
      newState.blocks = action.payload;
      return newState;

    case 'newBlock':
      newBlockData = action.payload.args;
      newState.blocks = [...state.blocks, newBlockData];
      newState.page.content = [...state.page.content, newBlockData.id];
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
    newBlock,
    setBlock,
    error,
  },
};

export default store;
