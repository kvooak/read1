/* eslint no-underscore-dangle: 0 */
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';

import clientSocket from '../../socket';
import documentActions from '../../redux/actions/documentActions';
import useKeyCombo from '../../_custom/Hook/useKeyCombo';
import useActiveElement from '../../_custom/Hook/useActiveElement';

import TranslatorBlock from '../Blocks/TranslatorBlock';
import BlockUtils from './functions/BlockUtils';
import Container from '../../_custom/UI/Container';

const BlocksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

const ContentWrapper = styled.div`
	cursor: text;
	display: flex;
	height: 100vh;
	flex-direction: column;
	flex-flow: column;
	padding: 0 16rem;
`;

const ClickToCreateZone = styled.div`
	width: 100%;
	flex: 1 1 auto;
	margin-left: auto;
`;

const Blocks = (props) => {
  const { blocks, lastBlockRef } = props;
  const [anchors, setAnchors] = useState([]);
  useEffect(() => {
    setAnchors(document.querySelectorAll('[data-anchor="true"]'));
  }, [blocks]);

  const handleMoveCursorUp = (currentIndex) => {
    const cursorIndex = currentIndex - 1;
    const targetBlock = anchors[cursorIndex];
    BlockUtils.focusBlock(targetBlock);
  };

  return (
    <BlocksWrapper>
      {blocks.map((block, index) => (
        <TranslatorBlock
          ref={index === blocks.length - 1 ? lastBlockRef : undefined}
          key={block.id}
          block={block}
          index={index}
          moveCursorUp={handleMoveCursorUp}
        />
      ))}
    </BlocksWrapper>
  );
};

Blocks.defaultProps = {
  lastBlockRef: null,
};

Blocks.propTypes = {
  lastBlockRef: PropTypes.instanceOf(Object),
  blocks: PropTypes.instanceOf(Array).isRequired,
};

export default function DocumentScreen() {
  const dispatch = useDispatch();
  const documentStore = useSelector((state) => state.document);
  const lastBlockRef = useRef(null);
  const recentBlockRef = useActiveElement();

  useEffect(() => {
    dispatch(documentActions.getDocumentByID('test_doc'));
  }, []);

  useKeyCombo(() => {
    const recentBlockId = recentBlockRef.dataset.blockId;
    const parentId = documentStore.identity._key;
    if (recentBlockId && parentId) {
      BlockUtils.addBlockBelow(parentId, recentBlockId);
    }
  }, ['Enter']);

  useEffect(() => {
    const { content } = documentStore.identity;
    if (content?.length) {
      clientSocket.getBlocks(content);
    }
  }, [documentStore.identity.content]);

  const addBlock = () => clientSocket.createBlock({
    parent_id: documentStore.identity._key,
    settings: { type: 'text' },
  });

  const bottomBlockNotEmpty = useMemo(() => {
    if (!lastBlockRef.current) return true;
    const bottomBlock = lastBlockRef.current;
    const hasContent = [...bottomBlock.children].some(
      (child) => child.dataset.content,
    );
    return hasContent;
  }, [lastBlockRef.current]);

  useEffect(() => {
    const bottomBlock = lastBlockRef.current;
    if (bottomBlock) {
      const anchorBlock = [...bottomBlock.children].find(
        (child) => child.dataset.anchor,
      );
      BlockUtils.focusBlock(anchorBlock);
    }
  }, [lastBlockRef.current]);

  const handleClickToCreate = () => {
    if (bottomBlockNotEmpty) {
      addBlock();
    } else {
      const anchorBlock = [...lastBlockRef.current.children].find(
        (child) => child.dataset.anchor,
      );
      BlockUtils.focusBlock(anchorBlock);
    }
  };

  useEffect(() => {
    if (
      documentStore.identity._key
			&& !documentStore.identity.content.length
    ) addBlock();
  }, [documentStore.identity]);

  return (
    <Container>
      <ContentWrapper>
        <Blocks
          blocks={documentStore.lines}
          lastBlockRef={lastBlockRef}
        />
        <ClickToCreateZone onClick={handleClickToCreate} />
      </ContentWrapper>

    </Container>
  );
}
