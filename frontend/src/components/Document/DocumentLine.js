import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { useDispatch } from 'react-redux';
import { UPDATE_LINE } from '../../redux/reducers/documentReducer';
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

  const handleChange = (event) => {
    dispatch(UPDATE_LINE({
      id: line.id,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <RowWrapper>
      <InputWrapper>
        <StandardInput
          multiline
          value={line.left}
          onChange={handleChange}
        />
      </InputWrapper>

      <SeparatorWrapper />

      <InputWrapper>
        <StandardInput
          multiline
          value={line.right}
          onChange={handleChange}
        />
      </InputWrapper>
    </RowWrapper>
  );
}

DocumentLine.propTypes = {
  line: PropTypes.instanceOf(Object).isRequired,
};
