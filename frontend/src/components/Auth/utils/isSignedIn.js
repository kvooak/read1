import firebase from 'firebase';

const isSignedIn = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      return true;
    }
    return false;
  });
};

export default isSignedIn;
