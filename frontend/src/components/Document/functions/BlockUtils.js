import clientSocket from './socket';

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

  focusBlock: (targetBlock) => {
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(targetBlock);
    range.collapse();
    selection.addRange(range);
  },

  addBlockBelow: (parentId, blockId) => {
    clientSocket.createBlock({
      parent_id: parentId,
      settings: {
        type: 'text',
        position: { below: blockId },
      },
    });
  },
};

export default BlockUtils;
