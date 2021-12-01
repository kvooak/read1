import { v4 as uuidv4 } from 'uuid';

const newBlockEmbryo = (id, parentID) => {
  const timeNow = Date.now();
  return {
    id,
    type: 'text',
    properties: { title: [['']] },
    content: [],
    parent: parentID,
    alive: true,
    last_edited_time: timeNow,
  };
};

const blockUpdate = (id, path, args) => ({
  pointer: { collection: 'blocks', id },
  path,
  command: 'update',
  args,
});

const blockSet = (id, path, args) => ({
  pointer: { collection: 'blocks', id },
  path,
  command: 'set',
  args,
});

const documentSet = (id, path, args) => ({
  pointer: { collection: 'documents', id },
  path,
  command: 'set',
  args,
});

const blockContentList = (id, command, args) => ({
  pointer: { collection: 'documents', id },
  path: ['content'],
  command,
  args,
});

const setBlockLastUpdated = (blockID) => {
  const timeNow = Date.now();
  return documentSet(blockID, ['last_edited_time'], timeNow);
};

const newBlockSharedOp = ({ cursorID, parentID, args, command }) => {
  let newBlockArgs = args;
  const id = uuidv4();
  const timeNow = Date.now();

  if (!newBlockArgs) {
    newBlockArgs = newBlockEmbryo(id, parentID);
  }

  newBlockArgs.id = id;
  newBlockArgs.created_time = timeNow;

  const contentListArgs = { after: cursorID || undefined, id };
  const setParentContentList = blockContentList(
    parentID,
    command,
    contentListArgs,
  );
  const setParentLastUpdated = setBlockLastUpdated(parentID);
  const setNewBlock = blockSet(id, [], newBlockArgs);
  const ops = [setNewBlock, setParentContentList, setParentLastUpdated];
  return ops;
};

const newBlockBelowCursor = (cursorID, parentID, args) => {
  const command = 'listAfter';
  const ops = newBlockSharedOp({
    args,
    cursorID,
    parentID,
    command,
  });

  return ops;
};

const newBlockAtBottom = (parentID, args) => {
  const command = 'listAtBottom';
  const ops = newBlockSharedOp({
    args,
    command,
    parentID,
  });

  return ops;
};

const killBlock = (blockID, parentID) => {
  const setParentLastUpdated = setBlockLastUpdated(parentID);
  const updateBlock = blockUpdate(blockID, ['alive'], false);
  const updateParentContentList = blockContentList(
    parentID,
    'listRemove',
    { id: blockID },
  );
  const ops = [updateBlock, updateParentContentList, setParentLastUpdated];
  return ops;
};

const setBlockType = (blockID, parentID, type) => {
  const setParentLastUpdated = setBlockLastUpdated(parentID);
  const setBlock = blockSet(blockID, ['type'], type);
  const ops = [setBlock, setParentLastUpdated];
  return ops;
};

const blockOperationSet = {
  newBlockBelowCursor,
  newBlockAtBottom,
  killBlock,
  setBlockType,
};

export default blockOperationSet;
