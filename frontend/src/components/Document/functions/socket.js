/* eslint camelcase: 0 */
/* eslint no-underscore-dangle: 0 */
import { io } from 'socket.io-client';

import { BASE_SOCKET_IO_URL } from '../../../constants/urls';

const socket = io(BASE_SOCKET_IO_URL);
socket.on('connect', () => {
  console.log(`socket #${socket.id}`);
});

socket.on('disconnect', () => {
  console.log('socket disconnected.');
});

const clientSocket = {
  getBlocks: (id_array) => {
    socket.emit('block:getBlocks', id_array, (res) => {
      console.log('block:getBlocks', res);
    });
  },
  updateBlock: (data, mode) => {
    socket.emit(`block:updateBlock${mode}`, data, (res) => {
      console.log('block:updateBlock', res);
    });
  },
  createBlock: ({ parent_id, settings }) => {
    socket.emit('block:createBlock', { parent_id, settings }, (res) => {
      console.log('block.createBlock', res);
    });
  },
  destroyBlock: (block_id) => {
    socket.emit('block:destroyBlock', block_id, (res) => {
      console.log('block:destroyBlock', res);
    });
  },
};

export default clientSocket;
