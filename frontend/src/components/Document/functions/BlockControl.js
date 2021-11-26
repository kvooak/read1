const BlockControl = {
  focusBlock: (targetBlock) => {
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(targetBlock);
    range.collapse();
    selection.addRange(range);
  },
};

export default BlockControl;
