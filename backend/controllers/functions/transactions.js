async function createOpShard(db, trans, operation) {
	const { args, command, path, pointer } = operation;
	const collection = await db.collection(pointer.collection);
	const recordID = pointer.id;
	let record;
	let updatedArgs = args;
	let index;
	let newProp;
	let propName;
	let propValue;

	const serveUpdatedArgs = async () => {
		record = await trans.step(() => collection.document(recordID));
		updated = path.reduce((proxy, key) => {
			return proxy[key];
		}, record);

		return updated;
	};

	switch (command) {
		case 'set':
			break;

		case 'update':
			break;
		
		case 'listAfter':
			updatedArgs = await serveUpdatedArgs();
			index = updatedArgs.indexOf(args.after);
			if (index > -1) updatedArgs.splice(index + 1, 0, args.id);
			break;

		case 'listAtBottom':
			updatedArgs = await serveUpdatedArgs();
			updatedArgs.push(args.id);	
			break;

		case 'listRemove':
			updatedArgs = await serveUpdatedArgs();
			index = updatedArgs.indexOf(args.id);
			if (index > -1) updatedArgs.splice(index, 1); 
			break;

		default:
			throw new Error('undefined operation command');
	}

	if (path.length === 0) {
		newProp = { '_new': args };
	} else {
		newProp = path.reverse().reduce((proxy, key, index) => {
			if (index === 0) {
				if (key) {
					proxy[key] = updatedArgs;
				} else {
					proxy = updatedArgs;
				}
				return proxy;
			}
			return { [key]: proxy };
		}, {});
	}

	[propName, propValue] = Object.entries(newProp)[0];

	return {
		collection,
		recordID,
		propName,
		propValue,
	};
}

async function dbOperation(trans, {
	collection,
	recordID,
	propName,
	propValue
}) {
	const keyShard = { _key: recordID };
	let updateData = { [propName]: propValue };

	if (propName === '_new') {
		updateData = { ...propValue, _key: propValue.id };
		await trans.step(() => collection.save(updateData));
	} else {
		await trans.step(() => collection.update(keyShard, updateData));
	}
};

async function createTransaction(db) {
	const trans = await db.beginTransaction({
		write: ['blocks', 'documents'],
	});

	return trans;
}

async function commitTransaction(trans, operationShards) {
	await Promise.all(
		operationShards.map(async (shard) => dbOperation(trans, shard)),
	);
	await trans.commit();		
};

module.exports = {
	createOpShard,
	dbOperation,
	createTransaction,
	commitTransaction,
};
