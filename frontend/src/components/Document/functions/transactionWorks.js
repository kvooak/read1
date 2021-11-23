import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import api from '../../../api/api';

const useSaveTransactions = ({
  transactions,
  setTransactions,
  dispatch,
  store,
}) => {
  useEffect(() => {
    let ignore = false;
    if (transactions.length) {
      const saveService = async () => {
        const result = await api.meta.saveTransactions(transactions);
        if (result.error) {
          dispatch(store.actions.error(result.error));
        }
        setTransactions([]);
      };

      if (!ignore) saveService();
    }
    return () => { ignore = true; };
  }, [transactions]);
};

const backgroundServices = ({
  useSaveTransactions,
});

const createTransaction = (operations) => ({
  id: uuidv4(),
  operations,
});

const transactions = {
  createTransaction,
  backgroundServices,
};

export default transactions;
