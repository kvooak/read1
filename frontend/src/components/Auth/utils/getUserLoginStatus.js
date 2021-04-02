/* eslint-disable no-unused-vars */
import firebase from 'firebase';

import { GET_USER_VALUE } from '../../../redux/reducers/userReducer';

const getUserLoginStatus = () => async (dispatch) => {
  firebase.auth().onAuthStateChanged((user) => {
    let userStatus;
    if (user) {
      const { currentUser } = firebase.auth();
      const {
        uid,
        email,
        emailVerified,
      } = currentUser;

      userStatus = {
        uid,
        email_address: email,
        is_signed_in: Boolean(user),
        email_verified: emailVerified,
      };
    } else {
      userStatus = {
        is_signed_in: false,
      };
    }
    return dispatch(GET_USER_VALUE(userStatus));
  });
};

export default getUserLoginStatus;
