/* eslint no-underscore-dangle: 0 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';

import clientSocket from '../../socket';
import useDebounce from '../../_custom/Hook/useDebounce';
import useKeyPress from '../../_custom/Hook/useKeyPress';
import documentSlice from '../../redux/reducers/documentSlice';
import StandardInput from '../../_custom/UI/StandardInput';
import StandardPopover from '../../_custom/UI/StandardPopover';

import BlockMenuInterface from './BlockMenuInterface';

const BlockWrapper = styled.div`
	z-index: 1400;
  display: flex;
  flex-direction: row;
  width: 100%;
`; // z-index of mui Popover is 1300

const InputWrapper = styled.div`
  width: 49.5%;
  border-bottom: 1px solid #EAEEF3;
`;

const SeparatorWrapper = styled.div`
  width: 1%;
`;

export default function DocumentLine(props) {
  const { block } = props;
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const openMenuButton = Boolean(anchorEl);
  const menuButtonId = openMenuButton ? `menu-button-${block.id}` : undefined;

  // send input to service
  const debouncedLeft = useDebounce(block.left, 120);
  const debouncedRight = useDebounce(block.right, 120);
  useEffect(() => {
    clientSocket.updateBlock({
      left: debouncedLeft,
      id: block.id,
    });
  }, [debouncedLeft]);

  useEffect(() => {
    clientSocket.updateBlock({
      right: debouncedRight,
      id: block.id,
    });
  }, [debouncedRight]);

  // prevent input if user presses command shortcut while being in the text field
  const shiftKeyPressed = useKeyPress('Shift');
  const handleKeyDown = (event) => {
    if (shiftKeyPressed && event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const handleChange = (event) => {
    const data = {
      id: block.id,
      [event.target.name]: event.target.value,
    };
    dispatch(documentSlice.actions.UPDATE_BLOCK(data));
  };

  return (
    <BlockWrapper
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <InputWrapper>
        <StandardInput
          name="left"
          multiline
          value={block.id}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </InputWrapper>

      <SeparatorWrapper />

      <InputWrapper>
        <StandardInput
          name="right"
          multiline
          value={block.right}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </InputWrapper>

      {block.id && (
      <StandardPopover
        disableEnforceFocus
        id={menuButtonId}
        open={openMenuButton}
        anchorEl={anchorEl}
        onClose={handleMouseLeave}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >

        <BlockMenuInterface blockId={block.id} />
      </StandardPopover>
      )}
    </BlockWrapper>
  );
}

DocumentLine.propTypes = {
  block: PropTypes.instanceOf(Object).isRequired,
};
