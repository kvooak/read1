const axios = require('axios');
const arango = require('arangojs');
const uuid = require('uuid');
const { isArangoError } = require('arangojs/error');
const print = require('../_utils/print');

const translate_with_deepl = (data, target_lang, callback, error) => {
	const authentication_key = 'f533babd-91ee-1d6a-2c82-259ed6103c1c:fx';
	const base_url = 'https://api-free.deepl.com/v2/translate';
	const auth_url = `?auth_key=${authentication_key}`;
	const target_lang_url = `&target_lang=${target_lang}`;
	const translation_url = `&text=${data}`;
	const url = `${base_url}${auth_url}${translation_url}${target_lang_url}`;
	axios.get(url)
		.then((data) => {
			callback(data.translations);
		})
		.catch((e) => error(e));
};

async function _createBlock(socket, parent_id, callback) {
	try {
		const block_collection = await socket.db.collection('blocks');
		const document_collection = await socket.db.collection('documents');

		let new_block = {
			_key: uuid.v4(),
			type: 'block',
			properties: { left: '', right: '' },
			content: [],
			parent: parent_id,
		};
		new_block = await block_collection.save(new_block, { returnNew: true });

		let parent = await document_collection.document(parent_id);
		parent = await document_collection.update(
			{ _key: parent_id },
			{ content: [...parent.content, new_block._key] },
			{ returnNew: true }
		);

		callback({
			new_block: new_block.new,
			parent: parent.new
		});
	} catch (e) {
		if (isArangoError(e)) {
			print.log({ code: e.code, message: e.message });
			print.error(e.stack);
		} else {
			throw e;
		}
	}
}

async function _getBlocks(socket, id_array, callback) {
	const query = arango.aql`
		FOR block IN blocks
			FILTER block._key IN ${id_array}
			RETURN block
	`;
	const cursor = await socket.db.query(query);
	const blocks = await cursor.all();
	callback(blocks);
};

async function _updateBlock(socket, data, callback) {
	const { id, left, right } = data;
	try {
		const collection = await socket.db.collection('blocks');
		let block = await collection.document(id);
		if (left !== undefined) block = await collection.update(
			{ _key: block._key },
			{ properties: { ...block.properties, left } },
			{ returnNew: true }
		);
		//if (left) translate_with_deepl(data, 'DE', async (translations) => {
		//		block = await collection.update(
		//			{ _key: block._key },
		//			{ properties: { ...block.properties, left, right: translations[0] } },
		//			{ returnNew: true }
		//		);
		//		callback(block.new);
		//	}, async (e) => {
		//		block = await collection.update(
		//			{ _key: block._key },
		//			{ properties: { ...block.properties, left } },
		//			{ returnNew: true }
		//		);
		//		callback(block.new);
		//		console.log(e.response.status, e.response.statusText);
		//	}
		//);

		if (right !== undefined) await collection.update(
				{ _key: block._key },
				{ properties: { ...block.properties, right } },
				{ returnNew: true }
		); 
	} catch (e) {
		if (isArangoError(e)) {
			print.log({ code: e.code, message: e.message });
			print.error(e.stack);
		} else {
			throw e;
		}
	}
};

module.exports = (socket) => {
	const updateBlock = (data, callback) => _updateBlock(socket, data, callback);  
	const getBlocks = (data, callback) => _getBlocks(socket, data, callback);
	const createBlock = (parent_id, callback) => _createBlock(socket, parent_id, callback);

	socket.on('block:createBlock', createBlock);
	socket.on('block:getBlocks', getBlocks);
	socket.on('block:updateBlock', updateBlock);
};
