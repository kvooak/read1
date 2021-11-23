/* eslint no-underscore-dangle: 0 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import striptags from 'striptags';

import clientSocket from '../Document/functions/socket';
import useDebounce from '../../_custom/Hook/useDebounce';
import StandardEditable from '../../_custom/UI/StandardEditable';
import StandardPopper from '../../_custom/UI/StandardPopper';

import BlockUtils from '../Document/functions/BlockUtils';
import BlockMenuInterface from '../Document/BlockMenuInterface';

const BlockWrapper = styled.div`
  display: inline-flex;
  width: 100%;
  border-bottom: 1px solid rgba(55, 53, 47, 0.1);
`;

const htmlStripper = striptags.init_streaming_mode([], '\n');

const TranslatorBlock = React.forwardRef((props, ref) => {
  const { block, index, moveCursorUp } = props;

  const [buffer, setBuffer] = useState(block);
  const debouncedBuffer = useDebounce(buffer, 120);

  useEffect(() => {
    if (debouncedBuffer) {
      clientSocket.updateBlock(debouncedBuffer, '');
    }
  }, [debouncedBuffer]);

  const handleChange = (event) => {
    const { name, content } = event.target.dataset;
    const cleanContent = htmlStripper(content);
    setBuffer({
      ...buffer,
      id: block.id,
      [name]: cleanContent,
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
    }
    if (index) { // do nothing if block is first block
      const blockDeleted = BlockUtils.checkQuickBlockDelete(event, buffer);
      if (blockDeleted) moveCursorUp(index);
    }
  };

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
        content={block.properties.left}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      <StandardEditable
        anchor={false}
        blockId={block.id}
        name="right"
        content={block.properties.right}
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

TranslatorBlock.propTypes = {
  block: PropTypes.instanceOf(Object).isRequired,
  index: PropTypes.number.isRequired,
  moveCursorUp: PropTypes.func.isRequired,
};

export default TranslatorBlock;
