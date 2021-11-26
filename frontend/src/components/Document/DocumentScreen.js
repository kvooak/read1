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

  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const handlePageContentChange = (operations) => {
    const transaction = transWorks.createTransaction(operations);
    addTransaction(transaction);
  };

  const syncTransactionWithStore = (operations, status) => {
    const [data] = operations;
    dispatch(store.actions.blockState({ status, data }));
    const transaction = transWorks.createTransaction(operations);
    addTransaction(transaction);
  };

  const handleDownKeyCommand = (event) => {
    const { key, target, shiftKey } = event;
    let operations;
    if (key === 'Enter' && !shiftKey) {
      operations = blockOperationSet.newBlock('text', state.page.id);
      syncTransactionWithStore(operations, 'new');
    } else if (key === 'Backspace') {
      const hasContent = Boolean(event.target.innerHTML);
      if (!hasContent) {
        operations = blockOperationSet.killBlock(
          target.dataset.blockId,
          state.page.id,
        );
        syncTransactionWithStore(operations, 'killed');
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
        />
        <ClickToCreateZone />
      </ContentWrapper>
    </Container>
  );
}
