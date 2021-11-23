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
import transactionWorks from './functions/transactionWorks';

import useKeyCombo from '../../_custom/Hook/useKeyCombo';

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

  transactionWorks.backgroundServices.useSaveTransactions({
    transactions,
    setTransactions,
    dispatch,
    store,
  });

  const handlePageContentChange = (operations) => {
    setTransactions((prev) => {
      const transaction = transactionWorks.createTransaction(operations);
      return [...prev, transaction];
    });
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
        dispatch(store.actions.fetchBlocks(res.data));
      }).catch((e) => {
        dispatch(store.actions.error(e.message));
      });
    }
  }, [state.page]);

  useKeyCombo(() => {
  }, ['Enter']);

  return (
    <Container>
      <ContentWrapper>
        <PageContent
          blocks={state.blocks}
          onChange={handlePageContentChange}
        />
        <ClickToCreateZone />
      </ContentWrapper>
    </Container>
  );
}
