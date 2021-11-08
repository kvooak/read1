const axios = require('axios');

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

module.exports = (io, socket) => {
	const updateLeftSide = async (data, callback) => {
		const text = data.left;
		translate_with_deepl( text, 'DE', (translations) => {
				const res_data = {
					id: data.id,
					right: translations[0], 
				};
				callback(res_data);
			}, (e) => {
				const res_data = {
					id: data.id,
					right: data.left,
				};
				callback(res_data);
				console.log(e.response.status, e.response.statusText);
			}
		);
	};

	socket.on('document:line:update:leftSide', updateLeftSide);
};
