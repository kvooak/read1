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
      const { operations } = action.payload;
      const [blockOp, listOp] = operations;
      const { args, command } = listOp;

      if (command === 'listRemove') {
        const blockID = blockOp.pointer.id;
        const index = state.blocks.findIndex((b) => b.id === blockID);
        newState.blocks.splice(index, 1);
        newState.page.content.splice(index, 1);
        return newState;
      }

      if (command === 'listAfter') {
        const afterIndex = state.blocks.findIndex((b) => b.id === args.after);
        newState.blocks.splice(afterIndex + 1, 0, blockOp.args);
        newState.page.content.splice(afterIndex + 1, 0, blockOp.pointer.id);
        return newState;
      }

      if (command === 'listAtBottom') {
        newState.blocks = [...state.blocks, blockOp.args];
        newState.page.content = [...state.page.content, blockOp.id];
        return newState;
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
