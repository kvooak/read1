/* eslint no-underscore-dangle: 0 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';

import DocumentLine from './DocumentLine';
import DocumentMenu from './DocumentMenu';

import useKeyCombo from '../../_custom/Hook/useKeyCombo';
import Container from '../../_custom/UI/Container';
import documentSlice from '../../redux/reducers/documentSlice';
import clientSocket from '../../socket';

import { getDocumentByID } from '../../redux/actions/documentActions';

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

  useEffect(() => {
    dispatch(getDocumentByID('test_doc'));
  }, []);

  const addBlock = () => clientSocket.createBlock('test_doc');

  useKeyCombo(addBlock, 'Shift', 'Enter');
  useEffect(() => {
    if (documentStore.identity._key && !documentStore.identity.content.length) {
      addBlock();
    }
  }, [documentStore.identity]);

  return (
    <Container>
      <DocumentMenu
        addLine={addBlock}
      />
      <Lines lines={documentStore.lines} />
    </Container>
  );
}
