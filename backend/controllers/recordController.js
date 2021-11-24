const arango = require('arangojs');
const { isArangoError } = require('arangojs/error');
const print = require('../_utils/print');
const transWorks = require('./functions/transactions');

exports.fetchRecords = async (req, res, next) => {
	try {
		const { request } = req.body;
		const recordIDs = request.operations.map((request) => {
			const { collection, id } = request.pointer;
			return  `${collection}/${id}`;
		});
		const query = arango.aql`RETURN DOCUMENT(${recordIDs})`;
		const cursor = await req.dbArango.query(query);
		let records = await cursor.all();
		records = records[0].map((rec) => ({
			...rec,
			id: rec._key
		}));
		res.status(200).send(records);
	} catch (e) {
		if (isArangoError(e)) {
			print({ code: e.code, message: e.message });
			print.error(e.stack);
		}
		next(e);
	}
};

exports.saveTransactions = async (req, res, next) => {
	try {
		const db = req.dbArango;
		const { transactions } = req.body.request;

		transactions.map(async (transaction) => {
			const { operations } = transaction;
			const trans = await transWorks.createTransaction(db);
			const opShards = await Promise.all(
				operations.map(
					async (op) => transWorks.createOpShard(db, trans, op),
				),
			);
			await transWorks.commitTransaction(trans, opShards);
		});

		res.status(200).send({});
	} catch (e) {
		if (isArangoError(e)) {
			print.log({ code: e.code, message: e.message });
			print.error(e.stack);
		}
		next(e);
	}
};
