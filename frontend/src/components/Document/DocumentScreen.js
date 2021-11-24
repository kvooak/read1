/* eslint no-underscore-dangle: 0 */
import React, {
  useMemo,
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

  const [contentBackup, setContentBackup] = useState([]);
  const autoFocusBlockID = useMemo(() => {
    if (state.page) {
      const { content } = state.page;
      let targetID;
      if (content.length > contentBackup.length) {
        targetID = content.find((id) => !contentBackup.includes(id));
      } else {
        const pos = contentBackup.findIndex((id) => !content.includes(id));
        targetID = content[pos - 1];
      }
      return targetID;
    }
  }, [state.page?.content, contentBackup]);

  useEffect(() => {
    if (autoFocusBlockID) {
      const targetBlock = document.getElementById(autoFocusBlockID);
      if (targetBlock) {
        BlockControl.focusBlock(targetBlock.firstElementChild);
      }
    }
  }, [autoFocusBlockID]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const handlePageContentChange = (operations) => {
    const transaction = transWorks.createTransaction(operations);
    addTransaction(transaction);
  };

  const handleKeyCommand = (event) => {
    const { key, shiftKey, target } = event;
    let operations;
    let transaction;

    if (key === 'Enter' && !shiftKey) {
      setContentBackup(state.page.content);
      operations = blockOperationSet.newBlockOps('text', 'test_doc');
      const [newBlockOp] = operations;
      dispatch(store.actions.newBlock(newBlockOp));
      transaction = transWorks.createTransaction(operations);
      addTransaction(transaction);
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
      <ContentWrapper>
        <PageContent
          blocks={state.blocks}
          onChange={handlePageContentChange}
          onReadKeyCommand={handleKeyCommand}
        />
        <ClickToCreateZone />
      </ContentWrapper>
    </Container>
  );
}
