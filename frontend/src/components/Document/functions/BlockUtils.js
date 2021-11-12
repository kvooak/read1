import clientSocket from '../../../socket';

const BlockUtils = {
  checkQuickBlockDelete: (event, block) => {
    const keyCheck = event.key === 'Backspace';
    const emptyBlockCheck = !block.left && !block.right;
    if (keyCheck && emptyBlockCheck) {
      event.preventDefault();
      return !clientSocket.destroyBlock(block.id);
    }
    return false;
  },
};

export default BlockUtils;
