import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';

import clientSocket from '../../socket';
import useDebounce from '../../_custom/Hook/useDebounce';
import useKeyPress from '../../_custom/Hook/useKeyPress';
import documentSlice from '../../redux/reducers/documentSlice';
import StandardInput from '../../_custom/UI/StandardInput';

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const InputWrapper = styled.div`
  width: 49.5%;
  border-bottom: 1px solid #EAEEF3;
`;

const SeparatorWrapper = styled.div`
  width: 1%;
`;

export default function DocumentLine(props) {
  const { line } = props;
  const dispatch = useDispatch();

  // send left input to service
  const debouncedLeft = useDebounce(line.left, 600);
  useEffect(() => {
    clientSocket.updateBlock({
      left: debouncedLeft,
      id: line.id,
    });
  }, [debouncedLeft]);

  // prevent input if user presses command shortcut while being in the text field
  const shiftKeyPressed = useKeyPress('Shift');
  const handleKeyDown = (event) => {
    if (shiftKeyPressed && event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const handleChange = (event) => {
    const data = {
      id: line.id,
      [event.target.name]: event.target.value,
    };
    dispatch(documentSlice.actions.UPDATE_LINE(data));
  };

  return (
    <RowWrapper>
      <InputWrapper>
        <StandardInput
          name="left"
          multiline
          value={line.left}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </InputWrapper>

      <SeparatorWrapper />

      <InputWrapper>
        <StandardInput
          name="right"
          multiline
          value={line.right}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </InputWrapper>
    </RowWrapper>
  );
}

DocumentLine.propTypes = {
  line: PropTypes.instanceOf(Object).isRequired,
};
