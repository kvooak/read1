const axios = require('axios');
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

async function _getBlocks(socket, id_array) {
	const collection = await socket.db.collection('blocks');
	const blocks = await collection.document(id_array);
	callback(blocks);
};

async function _updateBlock(socket, data, callback) {
	const { id, left, right } = data;
	try {
		const collection = await socket.db.collection('blocks');
		const block = await collection.document(id);

		let res_data;
		if (left) {
			translate_with_deepl(data, 'DE', async (translations) => {
					res_data = { id, right: translations[0] };
					callback(res_data);
					await block.update({ properties: { ...block.properties, left } });
				}, async (e) => {
					res_data = { id, right: data.left };
					callback(res_data);
					await block.update({ properties: { ...block.properties, left } });
					console.log(e.response.status, e.response.statusText);
				}
			);
		}

		if (right) await block.update({ right }); 
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
	const getBlocks = (data) => _getBlocks(socket, data);
	const createBlock = (parent_id, callback) => _createBlock(socket, parent_id, callback);

	socket.on('block:createBlock', createBlock);
	socket.on('block:getBlocks', getBlocks);
	socket.on('block:updateBlock', updateBlock);
};
