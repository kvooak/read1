import { v4 as uuidv4 } from 'uuid';

const newBlockEmbryo = (id, type, parentID, timeNow) => ({
  id,
  type,
  properties: { title: [['']] },
  content: [],
  parent: parentID,
  alive: true,
  last_edited_time: timeNow,
});

const blockUpdate = (collection, id, path, args) => ({
  pointer: { collection, id },
  path,
  command: 'update',
  args,
});

const blockSet = (collection, id, path, args) => ({
  pointer: { collection, id },
  path,
  command: 'set',
  args,
});

const blockContentList = (collection, id, command, args) => ({
  pointer: { collection, id },
  path: ['content'],
  command,
  args,
});

const newBlockSharedOp = ({
  type,
  cursorID,
  parentID,
  args,
  collection,
  command,
}) => {
  let newBlockArgs = args;
  const id = uuidv4();
  const timeNow = Date.now();

  if (!newBlockArgs) {
    newBlockArgs = newBlockEmbryo(id, type, parentID, timeNow);
  }

  newBlockArgs.id = id;
  newBlockArgs.created_time = timeNow;

  const ops = [
    blockUpdate('blocks', id, [], newBlockArgs),
    blockContentList(collection, parentID, command, {
      after: cursorID || undefined,
      id,
    }),
    blockSet('documents', parentID, ['last_edited_time'], timeNow),
  ];
  return ops;
};

const newBlockBelowCursor = (type, cursorID, parentID, args) => {
  const command = 'listAfter';
  const collection = 'documents';
  const ops = newBlockSharedOp({
    args,
    cursorID,
    command,
    collection,
    parentID,
    type,
  });

  return ops;
};

const newBlockAtBottom = (type, parentID, args) => {
  const command = 'listAtBottom';
  const collection = 'documents';
  const ops = newBlockSharedOp({
    args,
    command,
    collection,
    parentID,
    type,
  });

  return ops;
};

const killBlock = (blockID, parentID) => {
  const timeNow = Date.now();
  const ops = [
    blockUpdate('blocks', blockID, ['alive'], false),
    blockContentList('documents', parentID, 'listRemove', { id: blockID }),
    blockSet('documents', parentID, ['last_edited_time'], timeNow),
  ];
  return ops;
};

const blockOperationSet = {
  newBlockBelowCursor,
  newBlockAtBottom,
  killBlock,
};

export default blockOperationSet;
