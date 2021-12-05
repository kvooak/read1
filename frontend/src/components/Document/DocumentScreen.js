/* eslint no-underscore-dangle: 2 */
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import api from '../../api/api';
import store from './functions/store';
import { PageContext } from './PageStore';
import transWorks from './functions/transactionWorks';
import blockOperationSet from './functions/blockOperationSet';
import Container from '../../_custom/UI/Container';
import ContentWrapper from '../../_custom/UI/ContentWrapper';
import PageContent from './PageContent';
import StandardPopper from '../../_custom/UI/StandardPopper';
import BlockMenuInterface from './BlockMenuInterface';
import BlockTypeSearchInterface from './BlockTypeSearchInterface';
import useFocusBlock from '../../_custom/Hook/Blocks/useFocusBlock';
import useSaveTransactions from '../../_custom/Hook/Transactions/useSaveTransactions';

export default function DocumentScreen() {
  const { dispatch, state } = useContext(PageContext);
  const [transactions, setTransactions] = useState([]);

  const { createTransaction } = transWorks;
  const { killBlock, newBlockBelowCursor, setBlockType } = blockOperationSet;
  const pageID = state.page?.id;

  const [cursor, setCursor] = useState(null);
  useFocusBlock(cursor);

  const transactionResult = useSaveTransactions(transactions, 0);
  const clearTransactions = useCallback(() => {
    const { error } = transactionResult;
    if (error) dispatch(store.actions.error(error));
    setTransactions([]);
  }, [transactionResult]);

  useEffect(() => {
    if (transactionResult) clearTransactions();
  }, [transactionResult]);

  const handleBlockFocus = (event) => {
    const { target } = event;
    setCursor(target.closest('.block'));
  };

  const [refs, setRefs] = useState([]);
  const handleRegisterRef = (ref) => {
    setRefs((prev) => {
      const isNew = !prev.find((r) => r.id === ref.id);
      if (isNew) return [...prev, ref];
      return prev;
    });
    setCursor(ref);
  };

  const handleMoveCursorUp = (blockID) => {
    setRefs((prev) => {
      const current = [...prev];
      const index = current.findIndex((ref) => ref.id === blockID);
      current.splice(index, 1);
      setCursor(current[index - 1]);
      return current;
    });
  };

  const [hover, setHover] = useState(null);
  useEffect(() => {
    if (hover) {
      const { id } = hover;
      const blockData = state.blocks.find((b) => b.id === id);
      dispatch(store.actions.blockHovered(blockData));
    }
  }, [hover]);

  const findBlockRefByID = (id) => {
    const ref = refs.find((r) => r.id === id);
    return ref;
  };

  const findBlockRefByVerticalMousePos = (pos) => {
    const block = refs.find(
      (ref) => pos >= ref.offsetTop && pos <= ref.offsetTop + ref.clientHeight,
    );
    return block;
  };

  const handleMouseMove = (event) => {
    const { pageY } = event;
    const block = findBlockRefByVerticalMousePos(pageY);
    setHover(block);
  };

  const [typeSearchBlockID, setTypeSearchBlockID] = useState(null);
  const [typeSearchBlock, setTypeSearchBlock] = useState(null);
  useEffect(() => {
    if (typeSearchBlockID) {
      const block = findBlockRefByID(typeSearchBlockID);
      setTypeSearchBlock(block);
    }
  }, [typeSearchBlockID]);

  const handleTypeSearchCancel = () => {
    setTypeSearchBlockID(null);
    setTypeSearchBlock(null);
  };

  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const handlePageContentChange = (operations) => {
    const transaction = createTransaction(operations);
    addTransaction(transaction);
  };

  const syncTransactionWithStore = (operations) => {
    // update frontend changes
    dispatch(store.actions.blockState({ operations }));
    // regardless request state
    const transaction = createTransaction(operations);
    addTransaction(transaction);
  };

  const [operations, setOperations] = useState([]);
  useEffect(() => {
    if (operations.length) {
      syncTransactionWithStore(operations);
    }
  }, [operations]);

  const handleKillBlock = (blockID) => {
    setHover(null);
    setOperations(killBlock(blockID, pageID));
    handleMoveCursorUp(blockID);
  };

  const handleNewBlockBelowCursor = (cursorID, args) => {
    setOperations(newBlockBelowCursor(cursorID, pageID, args));
  };

  const handleBlockTypeSelect = (type) => {
    setOperations(setBlockType(typeSearchBlockID, pageID, type));
  };

  const handleAddBlockFromMenu = (blockID, args) => {
    handleNewBlockBelowCursor(blockID, args);
  };

  const handleDownKeyCommand = (event) => {
    const { key, target, shiftKey } = event;
    const blockID = target.dataset.blockId;

    if (key === 'Enter' && !shiftKey) {
      handleNewBlockBelowCursor(blockID);
      return;
    }
    if (key === 'Backspace') {
      const hasContent = Boolean(event.target.innerHTML);
      if (!hasContent) handleKillBlock(blockID);
      return;
    }
    if (key === '#') {
      setTypeSearchBlockID(blockID);
    }
  };

  useEffect(() => {
    api.pages
      .getPageByID('test_doc')
      .then((res) => {
        dispatch(store.actions.fetchPage(res.data));
      })
      .catch((e) => {
        dispatch(store.actions.error(e.message));
      });
  }, []);

  useEffect(() => {
    if (state.page) {
      api.blocks
        .fetchBlocks(state.page.content)
        .then((res) => {
          dispatch(store.actions.blocksFetched(res.data));
        })
        .catch((e) => {
          dispatch(store.actions.error(e.message));
        });
    }
  }, [state.page]);

  return (
    <Container>
      <ContentWrapper onMouseMove={handleMouseMove}>
        <DndProvider backend={HTML5Backend}>
          <PageContent
            onChange={handlePageContentChange}
            onReadDownKeyCommand={handleDownKeyCommand}
            onFocus={handleBlockFocus}
            onMount={handleRegisterRef}
          />
        </DndProvider>
      </ContentWrapper>

      {hover && (
        <StandardPopper
          id={hover.id}
          open={Boolean(hover)}
          anchorEl={hover}
          placement="left-start"
        >
          <BlockMenuInterface
            onKill={handleKillBlock}
            onAdd={handleAddBlockFromMenu}
          />
        </StandardPopper>
      )}

      {typeSearchBlock && (
        <StandardPopper
          id={typeSearchBlock.id}
          open={Boolean(typeSearchBlockID)}
          anchorEl={typeSearchBlock}
          placement="bottom-start"
        >
          <BlockTypeSearchInterface
            onTypeSelect={handleBlockTypeSelect}
            onSearchCancel={handleTypeSearchCancel}
          />
        </StandardPopper>
      )}
    </Container>
  );
}
