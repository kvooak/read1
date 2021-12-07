import { v4 as uuidv4 } from 'uuid';

/* START DEFAULT OPERATIONS */
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

const documentUpdate = (id, path, args) => ({
  pointer: { collection: 'documents', id },
  path,
  command: 'update',
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
/* END DEFAULT OPERATIONS */

/* START COMPLEX OPERATIONS */
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
  return [setNewBlock, setParentContentList, setParentLastUpdated];
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
  const updateParentContentList = blockContentList(parentID, 'listRemove', {
    id: blockID,
  });
  return [updateBlock, updateParentContentList, setParentLastUpdated];
};

const setBlockType = (blockID, parentID, type) => {
  const setParentLastUpdated = setBlockLastUpdated(parentID);
  const setBlock = blockSet(blockID, ['type'], type);
  return [setBlock, setParentLastUpdated];
};

const newDocumentContent = (documentID, content) => {
  const setDocumentContent = documentUpdate(documentID, ['content'], content);
  const setDocumentLastUpdated = setBlockLastUpdated(documentID);
  return [setDocumentContent, setDocumentLastUpdated];
};
/* END COMPLEX OPERATIONS */

const blockOperationSet = {
  newBlockBelowCursor,
  newBlockAtBottom,
  newDocumentContent,
  killBlock,
  setBlockType,
};

export default blockOperationSet;
