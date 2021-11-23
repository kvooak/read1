import axios from 'axios';
import {
  API_FETCH_RECORDS,
  API_SAVE_TRANSACTIONS,
} from '../constants/urls';

const fetchBlocks = async (idArray) => {
  const api = API_FETCH_RECORDS;
  const operations = idArray.map((id) => ({
    pointer: {
      collection: 'blocks',
      id,
    },
  }));
  const request = {
    operations,
  };

  return axios.post(api, { request });
};

const updateBlocks = async (request) => {
  const api = API_SAVE_TRANSACTIONS;
  return axios.post(api, { request });
};

const blockAPI = {
  fetchBlocks,
  updateBlocks,
};

export default blockAPI;
