import { io } from 'socket.io-client';
import store from './redux/store';
import documentSlice from './redux/reducers/documentSlice';

import { BASE_SOCKET_IO_URL } from './constants/urls';

const socket = io(BASE_SOCKET_IO_URL);
socket.on('connect', () => {
  console.log(`socket #${socket.id}`);
});

socket.on('disconnect', () => {
  console.log('socket disconnected.');
});

const clientSocket = {
  sendLeftSide: (data) => {
    socket.emit('document:line:update:leftSide', data, (res) => {
      const { id, right } = res;
      const payload = { id, right };
      store.dispatch(documentSlice.actions.UPDATE_LINE(payload));
    });
  },
};

export default clientSocket;
