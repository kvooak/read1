import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
  API_SAVE_TRANSACTIONS,
} from '../constants/urls';

const saveTransactions = async (transactions) => {
  const api = API_SAVE_TRANSACTIONS;
  const request = {
    id: uuidv4(),
    transactions,
  };
  let response;
  try {
    response = await axios.post(api, { request });
  } catch (e) {
    response = { error: e.message };
  }
  return response;
};

const meta = {
  saveTransactions,
};

export default meta;
