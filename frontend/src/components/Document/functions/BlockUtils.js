import clientSocket from '../../../socket';

const BlockUtils = {
  checkQuickBlockDelete: (event, buffer) => {
    const keyCheck = event.key === 'Backspace';
    const emptyBlockCheck = !buffer.left && !buffer.right;
    if (keyCheck && emptyBlockCheck) {
      event.preventDefault();
      return !clientSocket.destroyBlock(buffer.id);
    }
    return false;
  },
};

export default BlockUtils;
