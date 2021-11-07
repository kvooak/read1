import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { io } from 'socket.io-client';

import store from './redux/store';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BASE_SOCKET_IO_URL } from './constants/urls';

const socket = io.connect('http://localhost:8080');
socket.on('connect', () => {
  console.log(socket.connected);
  console.log(socket.id);
});
console.log(socket.connected);

socket.on('disconnect', () => {
  console.log(socket.connected);
  console.log(socket.id);
});

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
