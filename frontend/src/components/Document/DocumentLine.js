/* eslint no-underscore-dangle: 0 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import clientSocket from '../../socket';
import useDebounce from '../../_custom/Hook/useDebounce';
import useKeyPress from '../../_custom/Hook/useKeyPress';

import StandardEditable from '../../_custom/UI/StandardEditable';
import StandardPopper from '../../_custom/UI/StandardPopper';

import BlockUtils from './functions/BlockUtils';
import BlockMenuInterface from './BlockMenuInterface';

const BlockWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
	border-bottom: 1px solid rgba(55, 53, 47, 0.1);
	border-right: 1px solid rgba(55, 53, 47, 0.1);
`;

const InputWrapper = styled.div`
  width: 50%;
	border-left: 1px solid rgba(55, 53, 47, 0.1);
`;

export default function DocumentLine(props) {
  const { block } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const openMenuButton = Boolean(anchorEl);
  const menuButtonId = openMenuButton ? `menu-button-${block.id}` : undefined;

  // prevent input if user presses command shortcut while being in the text field
  const shiftKeyPressed = useKeyPress('Shift');
  const handleKeyDown = (event) => {
    BlockUtils.checkQuickBlockDelete(event.key, block);

    if (shiftKeyPressed && event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const [buffer, setBuffer] = useState();
  const debouncedBuffer = useDebounce(buffer, 120);
  const handleChange = (event) => {
    const { name, content } = event.target.dataset;
    const data = { id: block.id, [name]: content };
    setBuffer(data);
  };

  useEffect(() => {
    if (debouncedBuffer) {
      clientSocket.updateBlock(debouncedBuffer, '');
    }
  }, [debouncedBuffer]);

  return (
    <BlockWrapper
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <InputWrapper>
        <StandardEditable
          blockId={block.id}
          name="left"
          content={block.left}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </InputWrapper>

      <InputWrapper>
        <StandardEditable
          blockId={block.id}
          name="right"
          content={block.right}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </InputWrapper>

      {block.id && (
        <StandardPopper
          id={menuButtonId}
          open={openMenuButton}
          anchorEl={anchorEl}
          placement="left"
        >

          <BlockMenuInterface
            blockId={block.id}
          />
        </StandardPopper>
      )}
    </BlockWrapper>
  );
}

DocumentLine.propTypes = {
  block: PropTypes.instanceOf(Object).isRequired,
};
