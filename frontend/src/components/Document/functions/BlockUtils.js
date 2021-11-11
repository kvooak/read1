import clientSocket from '../../../socket';

const BlockUtils = {
  checkQuickBlockDelete: (pressedKey, block) => {
    const keyCheck = pressedKey === 'Backspace';
    const emptyBlockCheck = !block.left && !block.right;
    if (keyCheck && emptyBlockCheck) clientSocket.destroyBlock(block.id);
  },
};

export default BlockUtils;
