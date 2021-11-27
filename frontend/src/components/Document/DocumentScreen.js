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

  const activeElement = useActiveElement();
  useEffect(() => {
    if (activeElement.dataset.blockId) {
      setCursor(activeElement.parentElement);
    }
  }, [activeElement]);

  const [hover, setHover] = useState(null);
  const [hoverData, setHoverData] = useState(null);
  useEffect(() => {
    if (hover) {
      const { id } = hover;
      const block = state.blocks.find((b) => b.id === id);
      setHoverData(block);
    }
  }, [hover]);

  const handleMouseMove = (event) => {
    const { pageY } = event;
    const hoverIndex = refs.findIndex((ref) => (
      pageY >= ref.offsetTop
    	&& pageY <= ref.offsetTop + ref.clientHeight
    ));
    setHover(refs[hoverIndex]);
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

  const handleDownKeyCommand = (event) => {
    setHover(null);
    const { key, target, shiftKey } = event;
    let operations;
    if (key === 'Enter' && !shiftKey) {
      operations = blockOperationSet.newBlockBelowCursor(
        'text',
        cursor.id,
        state.page.id,
      );
      syncTransactionWithStore(operations);
    } else if (key === 'Backspace') {
      const hasContent = Boolean(event.target.innerHTML);
      if (!hasContent) {
        operations = blockOperationSet.killBlock(
          target.dataset.blockId,
          state.page.id,
        );
        syncTransactionWithStore(operations);
      }
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
          <BlockMenuInterface block={hoverData} />
        </StandardPopper>
      )}
    </Container>
  );
}
