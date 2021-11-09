import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  API_BASE_URL,
  DOCUMENT_SUFFIX,
} from '../../constants/urls';

export const getDocumentByID = createAsyncThunk(
  'document/GET_DOCUMENT_BY_ID',
  async (id) => {
    const api = `${API_BASE_URL}${DOCUMENT_SUFFIX}${id}`;
    return axios.get(api);
  },
);

export const createDocument = async () => {
  //
};
