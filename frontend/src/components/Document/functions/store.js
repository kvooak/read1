/* eslint no-case-declarations: 0 */
const initialState = {
  page: null,
  blocks: [],
  error: null,
  settings: {
    hoveredBlockData: null,
    blockDragHandle: null,
    blockWithHandleID: null,
  },
};

const documentState = (data) => ({
  type: 'documentState',
  payload: data,
});

const blockState = (data) => ({
  type: 'blockState',
  payload: data,
});

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

const blocksAfterMove = (data) => ({
  type: 'blocksAfterMove',
  payload: data,
});

const blockHovered = (data) => ({
  type: 'blockHovered',
  payload: data,
});

const blockWithHandleID = (data) => ({
  type: 'blockWithHandleID',
  payload: data,
});

const blockDragHandleReceived = (data) => ({
  type: 'blockDragHandleReceived',
  payload: data,
});

/* HELPER FUNCTIONS */
const updatePropBranch = (path, value) => {
  const branch = path.reverse().reduce((reduce, key, index) => {
    const proxy = { ...reduce };
    if (index === 0) {
      proxy[key] = value;
      return proxy;
    }
    return { [key]: proxy };
  }, {});
  const [propName, propValue] = Object.entries(branch)[0];
  return [propName, propValue];
};
/* END HELPER FUNCTIONS */

const reducer = (state, action) => {
  const newState = { ...state };
  let operations;

  switch (action.type) {
    case 'fetchPage':
      return {
        ...state,
        page: action.payload[0],
      };

    case 'blockHovered':
      newState.settings.hoveredBlockData = action.payload;
      return newState;

    case 'blockWithHandleID':
      newState.settings.blockWithHandleID = action.payload;
      return newState;

    case 'blockDragHandleReceived':
      newState.settings.blockDragHandle = action.payload;
      return newState;

    case 'blocksFetched':
      newState.blocks = action.payload;
      return newState;

    case 'blocksAfterMove':
      newState.blocks = action.payload;
      return newState;

    // documentState deals with pure document operations only
    // so it will use the first operation in operations array
    // as the actual operation that update meaningful document data,
    // as the second operation will just update
    // document 'last_updated_time'
    case 'documentState':
      operations = action.payload.operations;
      const [documentOp] = operations;
      if (documentOp.command === 'listRenew') {
        newState.page.content = documentOp.args;
      }
      return newState;

    case 'blockState':
      operations = action.payload.operations;
      const [blockOp, effectOp] = operations;
      const { args, command } = effectOp;
      const blockID = blockOp.pointer.id;
      const targetIndex = state.blocks.findIndex((b) => b.id === blockID);

      // effect command = 'set' means the block operation
      // is a normal update operation that doesn't change
      // the 'content' property of parent document.
      // so only 'last_updated_time' property of parent
      // got changed by a 'set' operation
      if (command === 'set') {
        const target = newState.blocks.find((b) => b.id === blockID);
        const [propName, propValue] = updatePropBranch(
          blockOp.path,
          blockOp.args,
        );
        target[propName] = propValue;
        newState.blocks[targetIndex] = target;
        return newState;
      }
      if (command === 'listRemove') {
        newState.blocks.splice(targetIndex, 1);
        newState.page.content.splice(targetIndex, 1);
        return newState;
      }
      if (command === 'listAfter') {
        const afterIndex = state.blocks.findIndex((b) => b.id === args.after);
        newState.blocks.splice(afterIndex + 1, 0, blockOp.args);
        newState.page.content.splice(afterIndex + 1, 0, blockID);
        return newState;
      }
      if (command === 'listAtBottom') {
        newState.blocks = [...state.blocks, blockOp.args];
        newState.page.content = [...state.page.content, blockID];
        return newState;
      }
      return newState;

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
    documentState,
    blockState,
    blocksFetched,
    blocksAfterMove,
    blockHovered,
    blockDragHandleReceived,
    blockWithHandleID,
    error,
  },
};

export default store;
