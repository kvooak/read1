import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';

import DocumentLine from './DocumentLine';
import DocumentMenu from './DocumentMenu';

import useKeyCombo from '../../_custom/Hook/useKeyCombo';
import Container from '../../_custom/UI/Container';
import documentSlice from '../../redux/reducers/documentSlice';

const LinesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

const Lines = (props) => {
  const { lines } = props;
  return (
    <LinesWrapper>
      {lines.map((line) => (
        <DocumentLine
          key={line.id}
          line={line}
        />
      ))}
    </LinesWrapper>
  );
};

Lines.propTypes = {
  lines: PropTypes.instanceOf(Array).isRequired,
};

export default function DocumentScreen() {
  const dispatch = useDispatch();
  const documentStore = useSelector((state) => state.document);

  const addLine = () => {
    dispatch(documentSlice.actions.ADD_BLANK_LINE());
  };

  useKeyCombo(addLine, 'Shift', 'Enter');
  const [lines, setLines] = useState([]);
  useEffect(() => {
    if (!documentStore.lines.length) {
      addLine();
    }

    setLines(documentStore.lines);
  }, [documentStore.lines]);

  return (
    <Container>
      <DocumentMenu
        addLine={addLine}
      />
      <Lines lines={lines} />
    </Container>
  );
}
