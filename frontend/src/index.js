import React from 'react';
import ReactDOM from 'react-dom';

import './css/bootstrap.min.css';
import './css/index.css';
import './css/custom.css';

import firebase from 'firebase';
import { Provider } from 'react-redux';
import store from './redux/store';

import App from './App';
import * as serviceWorker from './serviceWorker';

const firebaseConfig = {
  apiKey: 'AIzaSyBpi2CkTuVuZ9Mfub55N4Dc4SuQGoPsRws',
  authDomain: 'read-exchange-1.firebaseapp.com',
  projectId: 'read-exchange-1',
  storageBucket: 'read-exchange-1.appspot.com',
  messagingSenderId: '309198426885',
  appId: '1:309198426885:web:835a04718c3fc2e5ba1d6c',
  measurementId: 'G-K92XBR544B',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
