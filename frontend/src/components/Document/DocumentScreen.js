/* eslint no-underscore-dangle: 0 */
import React, {
  useState,
  useContext,
  useEffect,
} from 'react';

import api from '../../api/api';
import store from './functions/store';
import { PageContext } from './PageStore';
import transWorks from './functions/transactionWorks';
import blockOperationSet from './functions/blockOperationSet';
import BlockControl from './functions/BlockControl';
import useActiveElement from '../../_custom/Hook/useActiveElement';

import Container from '../../_custom/UI/Container';
import ContentWrapper from '../../_custom/UI/ContentWrapper';
import PageContent from './PageContent';
import StandardPopper from '../../_custom/UI/StandardPopper';
import BlockMenuInterface from './BlockMenuInterface';
import BlockTypeSearchInterface from './BlockTypeSearchInterface';

export default function DocumentScreen() {
  const { dispatch, state } = useContext(PageContext);
  const [transactions, setTransactions] = useState([]);

  transWorks.backgroundServices.useSaveTransactions({
    transactions,
    setTransactions,
    dispatch,
    store,
  }, 0);

  const [cursor, setCursor] = useState(null);
  useEffect(() => {
    if (cursor) BlockControl.focusBlock(cursor.firstChild);
  }, [cursor]);

  const [refs, setRefs] = useState([]);
  const handleRegisterRef = (ref) => {
    setRefs((prev) => [...prev, ref]);
    setCursor(ref);
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
    const ref = refs.find((r) => (r.id === id));
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

  useEffect(() => {
    if (!searchQuery || searchQuery?.length > 10) {
      setSearchQuery(null);
      setTypeSearchBlockID(null);
      setTypeSearchBlock(null);
    }
  }, [searchQuery]);

  const activeElement = useActiveElement();
  useEffect(() => {
    setTypeSearchBlockID(null);
    if (activeElement.dataset.blockId) {
      setCursor(activeElement.parentElement);
    }
  }, [activeElement]);

  const findBlockRefByVerticalMousePos = (pos) => {
    const block = refs.find((ref) => (
      pos >= ref.offsetTop && pos <= ref.offsetTop + ref.clientHeight
    ));
    return block;
  };

  const handleMouseMove = (event) => {
    const { pageY } = event;
    const block = findBlockRefByVerticalMousePos(pageY);
    setHover(block);
  };

  const handleDeregisterRef = (blockID) => {
    const index = refs.findIndex((ref) => ref.id === blockID);
    setCursor(refs[index - 1]);
    setRefs((prev) => {
      const current = [...prev];
      current.splice(index, 1);
      return current;
    });
  };

  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const handlePageContentChange = (operations) => {
    const transaction = transWorks.createTransaction(operations);
    addTransaction(transaction);
  };

  const syncTransactionWithStore = (operations) => {
    dispatch(store.actions.blockState({ operations }));
    const transaction = transWorks.createTransaction(operations);
    addTransaction(transaction);
  };

  const handleKillBlock = (blockID) => {
    setHover(null);
    const operations = blockOperationSet.killBlock(blockID, state.page.id);
    syncTransactionWithStore(operations);
  };

  const handleNewBlockBelowCursor = (args) => {
    const operations = blockOperationSet.newBlockBelowCursor(
      'text',
      cursor.id,
      state.page.id,
      args,
    );
    syncTransactionWithStore(operations);
  };

  const handleTypeSearchInput = (key) => {
    setSearchQuery((prev) => {
      let newString = prev;
      if (!newString) return `:${key}`;
      if (key === 'Backspace') return newString.slice(0, -1);
      newString += key;
      return newString;
    });
  };

  const handleDownKeyCommand = (event) => {
    const { key, target, shiftKey } = event;

    if (typeSearchBlockID) handleTypeSearchInput(key);
    if (key === 'Enter' && !shiftKey) {
      handleNewBlockBelowCursor();
      return;
    }
    if (key === 'Backspace') {
      const hasContent = Boolean(event.target.innerHTML);
      if (!hasContent) handleKillBlock(target.dataset.blockId);
      return;
    }
    if (key === ':' && !typeSearchBlockID) {
      setTypeSearchBlockID(target.dataset.blockId);
    }
  };

  useEffect(() => {
    api.pages.getPageByID('test_doc').then((res) => {
      dispatch(store.actions.fetchPage(res.data));
    }).catch((e) => {
      dispatch(store.actions.error(e.message));
    });
  }, []);

  useEffect(() => {
    if (state.page) {
      api.blocks.fetchBlocks(state.page.content).then((res) => {
        dispatch(store.actions.blocksFetched(res.data));
      }).catch((e) => {
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
          onMount={handleRegisterRef}
          onUnmount={handleDeregisterRef}
        />
      </ContentWrapper>

      {hover && (
        <StandardPopper
          id={hover.id}
          open={Boolean(hover)}
          anchorEl={hover}
          placement="left-end"
        >
          <BlockMenuInterface
            block={hoverData}
            onKill={handleKillBlock}
            onAdd={handleNewBlockBelowCursor}
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
          />
        </StandardPopper>
      )}
    </Container>
  );
}
