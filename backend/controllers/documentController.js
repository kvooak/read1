const { isArangoError } = require('arangojs/error');
const print = require('../_utils/print');

exports.getDocument = async (req, res, next) => {
	try {
		const { id } = req.params;
		const selector = { _key: id };
		const collection = await req.dbArango.collection('documents');
		const document = await collection.document(selector);

		res.status(200).send(document);
	} catch (e) {
		if (isArangoError(e)) {
			print({ code: e.code, message: e.message });
			print.error(e.stack);
		}
	}
};

exports.updateDocument = async (req, res, next) => {
	const collection = await req.dbArango.collection('documents');
	try {
		const { id } = req.params;
		const { content_id, action } = req.body;
		const selector = { _key: id };
		const document = await collection.exists(selector);

		if (!document) return res.status(404).send();

		let updated_content;
		switch (action) {
			case 'add':
				updated_content = [...document.content, content_id];
				break;

			case 'remove':
				updated_content = document.content.filter((id) => id !== content_id);
				break;

			default:
				updated_content = document.content;
				break;
		}

		await collection.update(selector, { content: updated_content });
		res.status(200).send();
	} catch (e) {
		if (isArangoError(e)) next({ code: e.code, message: e.message });
		print.error(e.stack);
	}
}
