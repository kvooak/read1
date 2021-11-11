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

async function _destroyBlock(socket, block_id, callback) {
	try {
		const block_collection = await socket.db.collection('blocks');
		const document_collection = await socket.db.collection('documents');

		const block = await block_collection.remove(
			{ _key: block_id },
			{ returnOld: true},
		);

		let parent = await document_collection.document({ _key: block.old.parent });
		parent = await document_collection.update(
			{ _key: block.old.parent },
			{ content: parent.content.filter((id) => id !== block_id)},
			{ returnNew: true},
		);

		if (block.old && parent.new) callback({ status_code: 200 });

	} catch (e) {
		callback({ status_code: e.code });

		if (isArangoError(e)) {
			print.log({ code: e.code, message: e.message });
			print.error(e.stack);
		} else {
			throw e;
		}
	}
}

async function _createBlock(socket, data, callback) {
	try {
		const { parent_id, position, from_block } = data;
		const block_collection = await socket.db.collection('blocks');
		const document_collection = await socket.db.collection('documents');

		let parent;
		let root_block;
		let new_block = {
			_key: uuid.v4(),
			type: 'translator',
			properties: { left: '', right: '' },
			content: [],
			updated_on: Date.now(),
			created_on: Date.now(),
		};

		if (from_block) {
			root_block = await block_collection.document(from_block);
			parent = await document_collection.document(root_block.parent);
			new_block.properties = root_block.properties;
		}

		if (parent_id) parent = await document_collection.document(parent_id);

		new_block.parent = parent._key;
		
		let anchor_pos;
		let new_parent_content = parent.content;
		if (position) {
			anchor_pos = new_parent_content.indexOf(position.below);
			console.log(anchor_pos);
			new_parent_content.splice(anchor_pos + 1, 0, new_block._key);
		} else {
			new_parent_content = [...parent.content, new_block._key]; 
		}

		new_block = await block_collection.save(new_block, { returnNew: true });

		parent = await document_collection.update(
			{ _key: parent._key },
			{ content: new_parent_content },
			{ returnNew: true }
		);

		callback({
			new_block: new_block.new,
			parent: parent.new,
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
	function mapByID(a, b) {
		return id_array.indexOf(a._key) - id_array.indexOf(b._key)
	};
	const sorted_blocks = blocks.sort(mapByID);
	callback(sorted_blocks);
};

async function _updateBlock(socket, data, callback) {
	const { id, left, right } = data;
	try {
		const collection = await socket.db.collection('blocks');
		let block = await collection.document(id);

		if (left !== undefined) block = await collection.update(
			{ _key: block._key },
			{
				properties: { ...block.properties, left },
				updated_on: Date.now(),
			},
			{ returnNew: true }
		);

		if (right !== undefined) block = await collection.update(
				{ _key: block._key },
				{
					properties: { ...block.properties, right },
					updated_on: Date.now(),
				},
			{ returnNew: true }
		); 

		callback(block.new);
	} catch (e) {
		if (isArangoError(e)) {
			print.log({ code: e.code, message: e.message });
			print.error(e.stack);
		} else {
			throw e;
		}
	}
};

async function _updateBlockTranslate(socket, data, callback) {
	const { id, left } = data;
	try {
		const collection = await socket.db.collection('blocks');
		let block = await collection.document(id);

		translate_with_deepl(data, 'DE', async (translations) => {
				block = await collection.update(
					{ _key: id },
					{ properties: { ...block.properties, left, right: translations[0] } },
					{ returnNew: true }
				);
				callback(block.new);
			}, async (e) => {
				block = await collection.update(
					{ _key: id },
					{ properties: { ...block.properties, left } },
					{ returnNew: true }
				);
				console.log(e.response.status, e.response.statusText);
				throw e;
			}
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
	const updateBlockTranslate = (data, callback) => _updateBlockTranslate(socket, data, callback);  
	const getBlocks = (data, callback) => _getBlocks(socket, data, callback);
	const createBlock = (data, callback) => _createBlock(socket, data, callback);
	const destroyBlock = (block_id, callback) => _destroyBlock(socket, block_id, callback);
	
	socket.on('block:createBlock', createBlock);
	socket.on('block:getBlocks', getBlocks);
	socket.on('block:destroyBlock', destroyBlock);
	socket.on('block:updateBlock', updateBlock);
	socket.on('block:updateBlock:translate', updateBlockTranslate);
};
