import axios from 'axios';
import {
  API_FETCH_RECORDS,
} from '../constants/urls';

const getPageByID = async (id) => {
  const api = API_FETCH_RECORDS;
  const request = {
    operations: [{
      pointer: {
        collection: 'documents',
        id,
      },
    }],
  };
  return axios.post(api, { request });
};

const createDocument = async () => {
  //
};

const pageAPI = {
  getPageByID,
  createDocument,
};

export default pageAPI;
