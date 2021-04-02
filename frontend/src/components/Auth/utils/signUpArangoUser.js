/* eslint-disable camelcase */
import axios from 'axios';
import firebase from 'firebase';

import {
  USER_PROFILE_CREATED,
  SIGN_UP_FORM_ERROR,
} from '../../../redux/reducers/userReducer';

import {
  API_BASE_URL,
  API_USER_SUFFIX,
  API_USER_SIGNUP_SUFFIX,
} from '../../../constants/urls';

const signUpArangoUser = () => async (dispatch) => {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const { currentUser } = firebase.auth();
      const { uid, email } = currentUser;
      const token = await currentUser.getIdToken(true);
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const apiURL = `${API_BASE_URL}${API_USER_SUFFIX}${API_USER_SIGNUP_SUFFIX}`;

      const data = { uid, email };
      axios.post(apiURL, data, { headers })
        .then((res) => {
          const { user_profile_created } = res.data;
          dispatch(USER_PROFILE_CREATED({ user_profile_created }));
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

export default signUpArangoUser;
