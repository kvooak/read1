const print = require('../../_utils/print');
const { isArangoError } = require('arangojs/error');

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
		try {
			record = await trans.step(() => collection.document(recordID));
			updated = path.reduce((proxy, key) => {
				return proxy[key];
			}, record);

			return updated;
		} catch (e) {
			print.log(`Error at ${serveUpdatedArgs.name}`)
			print.log({ recordID, record, updated, });
			if (isArangoError(e)) {
				print.log({ code: e.code, message: e.message });
			}
			throw e;
		}
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
	try {
		const keyShard = { _key: recordID };
		let updateData = { [propName]: propValue };

		if (propName === '_new') {
			updateData = { ...propValue, _key: propValue.id };
			await trans.step(() => collection.save(updateData));
		} else {
			await trans.step(() => collection.update(keyShard, updateData));
		}
	} catch (e) {
		print.log(`Error at ${dbOperation.name}`)
		print.log({ recordID, propName, propValue, collection: collection.name });
		if (isArangoError(e)) {
			print.log({ code: e.code, message: e.message });
			print.error(e.stack);
		}
		throw e;
	}
};

async function createTransaction(db) {
	try {
		const trans = await db.beginTransaction({
			write: ['blocks', 'documents'],
		});

		return trans;
	} catch (e) {
		print.log(`Error at ${createTransaction.name}`)
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
		print.log(`Error at ${commitTransaction.name}`)
		print.log({ trans, operationShards });
		if (isArangoError(e)) {
			print.log({ code: e.code, message: e.message });
		}
		throw e;
	}
};

module.exports = {
	createOpShard,
	dbOperation,
	createTransaction,
	commitTransaction,
};
