import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import DocumentLine from './DocumentLine';
import DocumentMenu from './DocumentMenu';

import Container from '../../_custom/UI/Container';

const Lines = (props) => {
  const { lines } = props;
  return (
    <>
      {lines.map((line) => (
        <DocumentLine
          key={line.id}
          line={line}
        />
      ))}
    </>
  );
};

Lines.propTypes = {
  lines: PropTypes.instanceOf(Array).isRequired,
};

export default function DocumentScreen() {
  const blankLine = {
    id: uuidv4(),
    left: '',
    right: '',
  };

  const documentReducer = useSelector((state) => state.document);
  const [lines, setLines] = useState([blankLine]);
  const addLine = () => {
    setLines([...lines, blankLine]);
  };

  return (
    <Container>
      <DocumentMenu
        addLine={addLine}
      />
      <Lines lines={lines} />
    </Container>
  );
}
