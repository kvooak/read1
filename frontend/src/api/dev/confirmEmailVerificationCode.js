/* eslint-disable camelcase */
import axios from 'axios';
import firebase from 'firebase';

import {
  SIGN_UP_FORM_VERIFICATION_CODE,
  SIGN_UP_FORM_ERROR,
} from '../../redux/reducers/userReducer';

import {
  API_BASE_URL,
  API_USER_SUFFIX,
  API_USER_VERIFY_EMAIL_SUFFIX,
} from '../../constants/urls';

const confirmEmailVerificationCode = (verification_code) => async (dispatch) => {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const { currentUser } = firebase.auth();
      const { uid } = currentUser;
      const token = await currentUser.getIdToken(true);
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const apiURL = `${API_BASE_URL}${API_USER_SUFFIX}${API_USER_VERIFY_EMAIL_SUFFIX}`;

      const data = { uid, verification_code };
      axios.patch(apiURL, data, { headers })
        .then((res) => {
          const { email_verified } = res.data;
          dispatch(SIGN_UP_FORM_VERIFICATION_CODE({ email_verified }));
        })
        .catch((error) => {
          const { code, message } = error;
          dispatch(SIGN_UP_FORM_ERROR({ code, message }));
        });
    } else {
      const error = new Error();
      error.code = 404;
      error.message = 'User not found';
      dispatch(SIGN_UP_FORM_ERROR(error));
    }
  });
};

export default confirmEmailVerificationCode;
