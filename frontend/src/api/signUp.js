import axios from 'axios';
import firebase from 'firebase';

import { SIGN_UP_FORM_ERROR } from '../redux/reducers/userReducer';

import {
  API_BASE_URL,
  API_USER_SIGNUP_SUFFIX,
} from '../constants/urls';

const signUp = () => async (dispatch) => {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const { currentUser } = firebase.auth();
      const { uid } = currentUser;
      const token = await currentUser.getIdToken(true);
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const apiURL = `${API_BASE_URL}${API_USER_SIGNUP_SUFFIX}`;

      const data = { uid };
      axios.post(apiURL, data, { headers })
        .then((res) => {
          console.log(res);
        });
    } else {
      const error = new Error();
      error.code = 404;
      error.message = 'User not found';
      dispatch(SIGN_UP_FORM_ERROR(error));
    }
  });
};

export default signUp;
