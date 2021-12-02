/* eslint no-underscore-dangle: 0 */
import React, { useState, useContext, useEffect } from 'react';

import api from '../../api/api';
import store from './functions/store';
import { PageContext } from './PageStore';
import transWorks from './functions/transactionWorks';
import blockOperationSet from './functions/blockOperationSet';
import BlockControl from './functions/BlockControl';

import Container from '../../_custom/UI/Container';
import ContentWrapper from '../../_custom/UI/ContentWrapper';
import PageContent from './PageContent';
import StandardPopper from '../../_custom/UI/StandardPopper';
import BlockMenuInterface from './BlockMenuInterface';
import BlockTypeSearchInterface from './BlockTypeSearchInterface';

export default function DocumentScreen() {
  const { dispatch, state } = useContext(PageContext);
  const [transactions, setTransactions] = useState([]);

  const { createTransaction } = transWorks;
  const { useSaveTransactions } = transWorks.backgroundServices;
  const { killBlock, newBlockBelowCursor, setBlockType } = blockOperationSet;
  const pageID = state.page?.id;

  useSaveTransactions(
    {
      transactions,
      setTransactions,
      dispatch,
      store,
    },
    0,
  );

  const [cursor, setCursor] = useState(null);
  useEffect(() => {
    if (cursor) {
      const editable = cursor.querySelector('.editable');
      BlockControl.focusBlock(editable);
    }
  }, [cursor]);

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
  const [hoverData, setHoverData] = useState(null);
  useEffect(() => {
    if (hover) {
      const { id } = hover;
      const block = state.blocks.find((b) => b.id === id);
      setHoverData(block);
    }
  }, [hover]);

  const findBlockRefByID = (id) => {
    const ref = refs.find((r) => r.id === id);
    return ref;
  };

  const [searchQuery, setSearchQuery] = useState(null);
  const [typeSearchBlockID, setTypeSearchBlockID] = useState(null);
  const [typeSearchBlock, setTypeSearchBlock] = useState(null);
  useEffect(() => {
    if (typeSearchBlockID) {
      const block = findBlockRefByID(typeSearchBlockID);
      setTypeSearchBlock(block);
    }
  }, [typeSearchBlockID]);

  const typeSearchCancel = () => {
    setSearchQuery(null);
    setTypeSearchBlockID(null);
    setTypeSearchBlock(null);
  };

  const handleTypeSearchCancel = () => {
    typeSearchCancel();
  };

  useEffect(() => {
    if (!searchQuery || searchQuery?.length > 10) {
      typeSearchCancel();
    }
  }, [searchQuery]);

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

  const handleTypeSearchInput = (key) => {
    setSearchQuery((prev) => {
      let newString = prev;
      if (!newString) return `#${key}`;
      if (key === 'Backspace') return newString.slice(0, -1);
      newString += key;
      return newString;
    });
  };

  const handleAddBlockFromMenu = (blockID, args) => {
    handleNewBlockBelowCursor(blockID, args);
  };

  const handleDownKeyCommand = (event) => {
    const { key, target, shiftKey } = event;
    const blockID = target.dataset.blockId;
    if (typeSearchBlockID) handleTypeSearchInput(key);
    if (key === 'Enter' && !shiftKey) {
      handleNewBlockBelowCursor(blockID);
      return;
    }
    if (key === 'Backspace') {
      const hasContent = Boolean(event.target.innerHTML);
      if (!hasContent) handleKillBlock(blockID);
      return;
    }
    if (key === '#' && !typeSearchBlockID) {
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
        <PageContent
          blocks={state.blocks}
          onChange={handlePageContentChange}
          onReadDownKeyCommand={handleDownKeyCommand}
          onFocus={handleBlockFocus}
          onMount={handleRegisterRef}
        />
      </ContentWrapper>

      {hover && (
        <StandardPopper
          id={hover.id}
          open={Boolean(hover)}
          anchorEl={hover}
          placement="left-start"
        >
          <BlockMenuInterface
            block={hoverData}
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
            searchQuery={searchQuery}
            onTypeSelect={handleBlockTypeSelect}
            onSearchCancel={handleTypeSearchCancel}
          />
        </StandardPopper>
      )}
    </Container>
  );
}
