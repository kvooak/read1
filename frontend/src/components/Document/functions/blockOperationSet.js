import { v4 as uuidv4 } from 'uuid';

const newBlockEmbryo = (id, type, parentID, timeNow) => ({
  id,
  type,
  properties: { title: [['']] },
  content: [],
  parent: parentID,
  alive: true,
  created_time: timeNow,
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

const newBlock = (type, parentID, args) => {
  let newBlockArgs = args;
  const id = uuidv4();
  const timeNow = Date.now();

  if (!newBlockArgs) {
    newBlockArgs = newBlockEmbryo(id, type, parentID, timeNow);
  }

  const ops = [
    blockUpdate('blocks', newBlockArgs.id, [], newBlockArgs),
    blockSet('documents', parentID, ['last_edited_time'], timeNow),
    blockContentList(
      'documents', parentID, 'listAtBottom', { id: newBlockArgs.id },
    ),
  ];
  return ops;
};

const killBlock = (blockID, parentID) => {
  const timeNow = Date.now();
  const ops = [
    blockUpdate('blocks', blockID, ['alive'], false),
    blockSet('documents', parentID, ['last_edited_time'], timeNow),
    blockContentList(
      'documents', parentID, 'listRemove', { id: blockID },
    ),
  ];
  return ops;
};

const blockOperationSet = {
  newBlock,
  killBlock,
};

export default blockOperationSet;
