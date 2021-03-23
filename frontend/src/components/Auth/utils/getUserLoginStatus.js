/* eslint-disable no-unused-vars */
import firebase from 'firebase';

function getUserLoginStatus() {
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

    return userStatus;
  });
}

export default getUserLoginStatus;
