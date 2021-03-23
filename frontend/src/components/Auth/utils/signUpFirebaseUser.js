import firebase from 'firebase';

const signUpFirebaseUser = async (email, password) => firebase.auth()
  .createUserWithEmailAndPassword(email, password)
  .then((userCredential) => userCredential)
  .catch((err) => {
    const { code, message } = err;
    return {
      code,
      message,
    };
  });

export default signUpFirebaseUser;
