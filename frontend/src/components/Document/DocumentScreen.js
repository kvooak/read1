/* eslint no-underscore-dangle: 0 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';

import DocumentLine from './DocumentLine';
import DocumentMenu from './DocumentMenu';

import useKeyCombo from '../../_custom/Hook/useKeyCombo';
import Container from '../../_custom/UI/Container';
import clientSocket from '../../socket';

import { getDocumentByID } from '../../redux/actions/documentActions';

const BlocksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

const ContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 0 6rem;
`;

const Blocks = (props) => {
  const { blocks } = props;
  return (
    <BlocksWrapper>
      {blocks.map((block) => (
        <DocumentLine
          key={block.id}
          block={block}
        />
      ))}
    </BlocksWrapper>
  );
};

Blocks.propTypes = {
  blocks: PropTypes.instanceOf(Array).isRequired,
};

export default function DocumentScreen() {
  const dispatch = useDispatch();
  const documentStore = useSelector((state) => state.document);
  console.log(documentStore.lines);
  useEffect(() => {
    dispatch(getDocumentByID('test_doc'));
  }, []);

  useEffect(() => {
    const { content } = documentStore.identity;
    if (content?.length) clientSocket.getBlocks(content);
  }, [documentStore.identity.content]);

  const addBlock = () => clientSocket.createBlock('test_doc');

  useKeyCombo(addBlock, 'Shift', 'Enter');
  useEffect(() => {
    if (documentStore.identity._key && !documentStore.identity.content.length) {
      addBlock();
    }
  }, [documentStore.identity]);

  return (
    <Container>
      <ContentWrapper>
        <DocumentMenu
          addBlock={addBlock}
        />
        <Blocks blocks={documentStore.lines} />
      </ContentWrapper>
    </Container>
  );
}
