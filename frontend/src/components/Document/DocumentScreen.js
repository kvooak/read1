/* eslint no-underscore-dangle: 0 */
import React, {
  useState,
  useContext,
  useEffect,
} from 'react';
import styled from '@emotion/styled';

import api from '../../api/api';
import store from './functions/store';
import { PageContext } from './PageStore';
import transWorks from './functions/transactionWorks';
import blockOperationSet from './functions/blockOperationSet';
import BlockControl from './functions/BlockControl';

import Container from '../../_custom/UI/Container';
import PageContent from './PageContent';

const ContentWrapper = styled.div`
	cursor: text;
	display: flex;
	height: 100vh;
	flex-direction: column;
	flex-flow: column;
	padding: 0 16rem;
	color: rgb(55, 53, 47);
	font-family: -apple-system,
		BlinkMacSystemFont,
		"Segoe UI",
		Roboto,
		"Helvetica Neue",
		Arial,
		sans-serif,
		"Apple Color Emoji",
		"Segoe UI Emoji",
		"Segoe UI Symbol";
`;

const ClickToCreateZone = styled.div`
	width: 100%;
	flex: 1 1 auto;
	margin-left: auto;
`;

export default function DocumentScreen() {
  const { dispatch, state } = useContext(PageContext);
  const [transactions, setTransactions] = useState([]);

  transWorks.backgroundServices.useSaveTransactions({
    transactions,
    setTransactions,
    dispatch,
    store,
  });

  const [cursor, setCursor] = useState(null);
  useEffect(() => {
    if (cursor) BlockControl.focusBlock(cursor.firstChild);
  }, [cursor]);

  const handleSetCursor = (ref) => {
    setCursor(ref);
  };

  const [refs, setRefs] = useState([]);
  const handleRegisterRef = (ref) => {
    setRefs((prev) => [...prev, ref]);
    setCursor(ref);
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

  const handleUpKeyCommand = () => {
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
      <ContentWrapper>
        <PageContent
          blocks={state.blocks}
          onChange={handlePageContentChange}
          onReadDownKeyCommand={handleDownKeyCommand}
          onReadUpKeyCommand={handleUpKeyCommand}
          onMount={handleRegisterRef}
          onUnmount={handleDeregisterRef}
          onFocus={handleSetCursor}
        />
        <ClickToCreateZone />
      </ContentWrapper>
    </Container>
  );
}
