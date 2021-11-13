import axios from 'axios';
import {
  API_BASE_URL,
  DOCUMENT_SUFFIX,
} from '../../constants/urls';
import documentSlice from '../reducers/documentSlice';

const getDocumentByID = (id) => async (dispatch) => {
  const api = `${API_BASE_URL}${DOCUMENT_SUFFIX}${id}`;
  const res = await axios.get(api);
  if (res.status === 200) {
    dispatch(documentSlice.actions.GET_DOC_BY_ID(res.data));
  }
};

const createDocument = async () => {
  //
};

const documentActions = {
  getDocumentByID: (id) => getDocumentByID(id),
  createDocument: () => createDocument(),
};

export default documentActions;
