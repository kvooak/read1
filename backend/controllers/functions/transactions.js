async function createOpShard(db, trans, operation) {
	const { args, command, path, pointer } = operation;
	const collection = await db.collection(pointer.collection);
	const recordID = pointer.id;
	let updatedArgs = args;
	let newProp;
	let propName;
	let propValue;

	switch (command) {
		case 'set':
			break;

		case 'update':
			break;

		case 'listAtBottom':
			const record = await trans.step(() => collection.document(recordID));
			updatedArgs = path.reduce((proxy, key) => {
				return proxy[key];
			}, record);
			updatedArgs.push(args.id);	
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
