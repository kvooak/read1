/* eslint no-underscore-dangle: 0 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';

import documentActions from '../../redux/actions/documentActions';

import DocumentLine from './DocumentLine';
import DocumentMenu from './DocumentMenu';

import useDebounce from '../../_custom/Hook/useDebounce';
import useActiveElement from '../../_custom/Hook/useActiveElement';
import useKeyCombo from '../../_custom/Hook/useKeyCombo';
import Container from '../../_custom/UI/Container';
import clientSocket from '../../socket';

const BlocksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

const ContentWrapper = styled.div`
	display: flex;
	height: 100vh;
	flex-direction: column;
	padding: 0 16rem;
`;

const Blocks = (props) => {
  const { blocks } = props;

  const [anchors, setAnchors] = useState([]);
  useEffect(() => {
    setAnchors(document.querySelectorAll('[data-anchor="true"]'));
  }, [blocks]);

  const handleMoveCursorUp = (currentIndex) => {
    const cursorIndex = currentIndex - 1;
    const targetBlock = anchors[cursorIndex];
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(targetBlock);
    range.collapse();
    selection.addRange(range);
  };

  return (
    <BlocksWrapper>
      {blocks.map((block, index) => (
        <DocumentLine
          key={block.id}
          block={block}
          index={index}
          moveCursorUp={handleMoveCursorUp}
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

  // need to refactor later for better mechanism to detect
  // when to add a new empty text block at the bottom
  // direction: create a w:1px h:vh inline-block div at the bottom
  const activeElement = useActiveElement();
  const debouncedActive = useDebounce(activeElement, 20);
  useEffect(() => {
    if (!activeElement && !debouncedActive) {
      clientSocket.createBlock({
        parent_id: 'test_doc',
        settings: { type: 'text' },
      });
    }
  }, [activeElement, debouncedActive]);

  useEffect(() => {
    dispatch(documentActions.getDocumentByID('test_doc'));
  }, []);

  useEffect(() => {
    const { content } = documentStore.identity;
    if (content?.length) clientSocket.getBlocks(content);
  }, [documentStore.identity.content]);

  const addBlock = () => clientSocket.createBlock({
    parent_id: documentStore.identity._key,
    settings: {
      type: 'text',
    },
  });

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
