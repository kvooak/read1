import clientSocket from '../../../socket';

const BlockUtils = {
  checkQuickBlockDelete: (pressedKey, block) => {
    const keyCheck = pressedKey === 'Backspace';
    const emptyBlockCheck = !block.left && !block.right;
    if (keyCheck && emptyBlockCheck) {
      return !clientSocket.destroyBlock(block.id);
    }
    return false;
  },
};

export default BlockUtils;
