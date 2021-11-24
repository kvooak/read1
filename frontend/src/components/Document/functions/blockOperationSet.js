import { v4 as uuidv4 } from 'uuid';

const newBlockOps = (type, parent, args) => {
  let newBlockEmbryo = args;
  const id = uuidv4();
  const timeNow = Date.now();

  if (!newBlockEmbryo) {
    newBlockEmbryo = {
      id,
      type,
      properties: {
        title: [['']],
      },
      content: [],
      parent,
      alive: true,
      created_time: timeNow,
      last_edited_time: timeNow,
    };
  }

  const newBlockOp = {
    pointer: {
      collection: 'blocks',
      id: newBlockEmbryo.id,
    },
    path: [],
    command: 'update',
    args: newBlockEmbryo,
  };

  const parentBlockListChildOp = {
    pointer: {
      collection: 'documents',
      id: parent,
    },
    path: ['content'],
    command: 'listAtBottom',
    args: {
      id: newBlockEmbryo.id,
    },
  };

  const parentBlockTimestampOp = {
    pointer: {
      collection: 'documents',
      id: parent,
    },
    path: ['last_edited_time'],
    command: 'set',
    args: timeNow,
  };

  const ops = [
    newBlockOp,
    parentBlockTimestampOp,
    parentBlockListChildOp,
  ];
  return ops;
};

const blockOperationSet = {
  newBlockOps,
};

export default blockOperationSet;
