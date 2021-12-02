const print = require('../../_utils/print');
const { isArangoError } = require('arangojs/error');

// At the moment the list logics only apply to 'content' prop of a block
// when adding or removing child blocks etc.
const createSeedFromList = (record, path) => {
  try {
    let value;
    if (!path.length) {
      value = record;
    } else {
      value = path.reduce((proxy, key) => proxy[key], record);
    }
    return { value, path };
  } catch (e) {
    print.log(`Error at ${serveBranchSeed.name}`);
    print.log({ record, path });
    throw e;
  }
};

const createSimpleSeed = (args, path) => {
  try {
    return { value: args, path };
  } catch (e) {
    print.log(`Error at ${createSimpleSeed.name}`);
    print.log({ args, path });
    throw e;
  }
};

const updatePropBranch = (seed) => {
  try {
    const { value, path } = seed;
    let newProp;
    if (!path.length) {
      newProp = { _new: value };
    } else {
      newProp = path.reverse().reduce((reducer, key, index) => {
        const proxy = { ...reducer };
        if (index === 0) {
          proxy[key] = value;
          return proxy;
        }
        return { [key]: proxy };
      }, {});
    }
    const [propName, propValue] = Object.entries(newProp)[0];
    return [propName, propValue];
  } catch (e) {
    print.log(`Error at ${createNewPropBranch.name}`);
    print.log({ seed });
    throw e;
  }
};

async function createOpShard(db, trans, operation) {
  const { args, command, path, pointer } = operation;
  const collection = await db.collection(pointer.collection);
  const recordID = pointer.id;
  let record;
  let index;
  let seed;
  // if path === [] => this is a new block.
  // so set record = args otherwise collection.document() returns error
  if (path.length) {
    record = await trans.step(() => collection.document(recordID));
  } else {
    record = args;
  }

  switch (command) {
    case 'set':
    case 'update':
      seed = createSimpleSeed(args, path);
      break;

    case 'listAfter':
      seed = createSeedFromList(record, path);
      index = seed.value.indexOf(args.after);
      if (index > -1) seed.value.splice(index + 1, 0, args.id);
      break;

    case 'listAtBottom':
      seed = createSeedFromList(record, path);
      seed.value.push(record.id);
      break;

    case 'listRemove':
      seed = createSeedFromList(record, path);
      index = seed.value.indexOf(args.id);
      if (index > -1) seed.value.splice(index, 1);
      break;

    default:
      throw new Error('undefined operation command');
  }

  const [propName, propValue] = updatePropBranch(seed);
  return {
    collection,
    recordID,
    propName,
    propValue,
  };
}

async function dbOperation(trans, shard) {
  try {
    const { collection, recordID, propName, propValue } = shard;
    const keyShard = { _key: recordID };
    let updateData = { [propName]: propValue };

    if (propName === '_new') {
      updateData = { ...propValue, _key: propValue.id };
      await trans.step(() => collection.save(updateData));
    } else {
      await trans.step(() => collection.update(keyShard, updateData));
    }
  } catch (e) {
    print.log(`Error at ${dbOperation.name}`);
    print.log({ shard });
    if (isArangoError(e)) {
      print.log({ code: e.code, message: e.message });
      print.error(e.stack);
    }
    throw e;
  }
}

async function createTransaction(db) {
  try {
    const trans = await db.beginTransaction({
      write: ['blocks', 'documents'],
    });

    return trans;
  } catch (e) {
    print.log(`Error at ${createTransaction.name}`);
    print.log({ trans });
    if (isArangoError(e)) {
      print.log({ code: e.code, message: e.message });
    }
    throw e;
  }
}

async function commitTransaction(trans, operationShards) {
  try {
    await Promise.all(
      operationShards.map(async (shard) => dbOperation(trans, shard)),
    );
    await trans.commit();
  } catch (e) {
    print.log(`Error at ${commitTransaction.name}`);
    print.log({ trans, operationShards });
    if (isArangoError(e)) {
      print.log({ code: e.code, message: e.message });
    }
    throw e;
  }
}

module.exports = {
  createOpShard,
  dbOperation,
  createTransaction,
  commitTransaction,
};
