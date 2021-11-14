/* eslint no-underscore-dangle: 0 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import striptags from 'striptags';

import clientSocket from '../../socket';
import useDebounce from '../../_custom/Hook/useDebounce';
import useKeyPress from '../../_custom/Hook/useKeyPress';

import StandardEditable from '../../_custom/UI/StandardEditable';
import StandardPopper from '../../_custom/UI/StandardPopper';

import BlockUtils from './functions/BlockUtils';
import BlockMenuInterface from './BlockMenuInterface';

const BlockWrapper = styled.div`
  display: inline-flex;
  width: 100%;
	border-bottom: 1px solid rgba(55, 53, 47, 0.1);
`;

const htmlStripper = striptags.init_streaming_mode([], '\n');

const DocumentLine = React.forwardRef((props, ref) => {
  const { block, index, moveCursorUp } = props;
  const [buffer, setBuffer] = useState(block);
  const debouncedBuffer = useDebounce(buffer, 120);
  const handleChange = (event) => {
    const { name, content } = event.target.dataset;
    const cleanContent = htmlStripper(content);
    setBuffer({
      ...buffer,
      id: block.id,
      [name]: cleanContent,
    });
  };

  useEffect(() => {
    if (debouncedBuffer) {
      clientSocket.updateBlock(debouncedBuffer, '');
    }
  }, [debouncedBuffer]);

  /* TOGGLE BLOCK MENU */
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMouseLeave = () => {
    setAnchorEl(null);
  };
  const openMenuButton = Boolean(anchorEl);
  const menuButtonId = openMenuButton ? `menu-button-${block.id}` : undefined;
  /* END TOGGLE BLOCK MENU */

  // prevent input if user presses command shortcut while being in the text field
  const shiftKeyPressed = useKeyPress('Shift');
  const handleKeyDown = (event) => {
    if (index) { // do nothing if block is first block
      const blockDeleted = BlockUtils.checkQuickBlockDelete(event, buffer);
      if (blockDeleted) moveCursorUp(index);
    }

    if (shiftKeyPressed && event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const blockId = `block-${block.id}`;

  return (
    <BlockWrapper
      ref={ref}
      id={blockId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <StandardEditable
        anchor
        blockId={block.id}
        name="left"
        content={block.left}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      <StandardEditable
        anchor={false}
        blockId={block.id}
        name="right"
        content={block.right}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      {block.id && (
      <StandardPopper
        id={menuButtonId}
        open={openMenuButton}
        anchorEl={anchorEl}
        placement="left"
      >

        <BlockMenuInterface
          blockId={buffer.id}
        />
      </StandardPopper>
      )}
    </BlockWrapper>
  );
});

DocumentLine.propTypes = {
  block: PropTypes.instanceOf(Object).isRequired,
  index: PropTypes.number.isRequired,
  moveCursorUp: PropTypes.func.isRequired,
};

export default DocumentLine;
