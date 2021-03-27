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
        emailVerified,
      } = currentUser;

      userStatus = {
        uid,
        isSignedIn: Boolean(user),
        emailVerified,
      };
    } else {
      userStatus = {
        isSignedIn: false,
      };
    }
    return dispatch(GET_USER_VALUE(userStatus));
  });
};

export default getUserLoginStatus;
