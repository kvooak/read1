/* eslint-disable no-shadow */
import firebase from 'firebase';
import {
  TOO_MANY_REQUESTS,
  USER_NOT_FOUND,
  WRONG_PASSWORD_SIGNUP,
} from './firebaseErrorCodes';

const signUpFirebaseUser = async (email, password) => firebase.auth()
  .signInWithEmailAndPassword(email, password)
  .then((userCredential) => userCredential)
  .catch((err) => {
    const { code, message } = err;

    switch (code) {
      case TOO_MANY_REQUESTS.code:
        return {
          code: TOO_MANY_REQUESTS.code,
          message: TOO_MANY_REQUESTS.message,
        };

      case WRONG_PASSWORD_SIGNUP.code:
        return {
          code: WRONG_PASSWORD_SIGNUP.code,
          message: WRONG_PASSWORD_SIGNUP.message,
        };

      case USER_NOT_FOUND.code:
        return firebase.auth()
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential) => userCredential)
          .catch((e) => {
            const { code, message } = e;
            return {
              code,
              message,
            };
          });

      default:
        return {
          code,
          message,
        };
    }
  });

export default signUpFirebaseUser;
