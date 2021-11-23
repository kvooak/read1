async function createOperationServing(db, operation) {
	const { args, command, path, pointer } = operation;

	const collection = await db.collection(pointer.collection);
	const recordID = pointer.id;
	let propName;
	let propValue;

	switch (command) {
		case 'set':
		case 'update':
			let newProp = path.reverse().reduce((proxy, key, index) => {
				if (index === 0) {
					proxy[key] = args;
					return proxy;
				}
				return { [key]: proxy };
			}, {});

			[propName, propValue] = Object.entries(newProp)[0];
			break;

		default:
			throw new Error('undefined operation command');
	}
	
	return {
		collection,
		recordID,
		propName,
		propValue,
	};
}

async function dbOperation(collection, recordID, propName, propValue) {
	await collection.update(
		{ _key: recordID },
		{ [propName]: propValue },
	);
};

async function createAndCommitTransaction(db, actionSeeds) {
	const arangoTran = await db.beginTransaction({
		read: ['blocks'],
		write: ['blocks'],
	});

	actionSeeds.forEach(async ({ collection, recordID, propName, propValue }) => {
		await arangoTran.step(() => dbOperation(collection, recordID, propName, propValue));
	});

	await arangoTran.commit();		
};

module.exports = {
	createOperationServing,
	dbOperation,
	createAndCommitTransaction,
};
