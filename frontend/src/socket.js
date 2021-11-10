/* eslint camelcase: 0 */
/* eslint no-underscore-dangle: 0 */
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
  getBlocks: (id_array) => {
    socket.emit('block:getBlocks', id_array, (res) => {
      const payload = res.map((block) => ({
        id: block._key,
        left: block.properties.left,
        right: block.properties.right,
      }));
      store.dispatch(documentSlice.actions.GET_BLOCKS(payload));
    });
  },
  updateBlock: (data) => {
    socket.emit('block:updateBlock', data, (block) => {
      const payload = {
        id: block._key,
        left: block.properties.left,
        right: block.properties.right,
      };
      store.dispatch(documentSlice.actions.UPDATE_BLOCK(payload));
    });
  },
  createBlock: (parent_id) => {
    socket.emit('block:createBlock', parent_id, (res) => {
      const { new_block, parent } = res;
      store.dispatch(documentSlice.actions.ADD_BLOCK({
        id: new_block._key,
        left: new_block.properties.left,
        right: new_block.properties.right,
      }));

      store.dispatch(documentSlice.actions.UPDATE_DOC_IDENTITY(parent));
    });
  },
  destroyBlock: (block_id) => {
    socket.emit('block:destroyBlock', block_id, (res) => {
      const { status_code } = res;
      switch (status_code) {
        case 200:
          store.dispatch(documentSlice.actions.DESTROY_BLOCK(block_id));
          break;
        default:
          store.dispatch(documentSlice.actions.BLOCK_ERROR(status_code));
          break;
      }
    });
  },
};

export default clientSocket;
