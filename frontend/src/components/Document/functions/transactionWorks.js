import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import api from '../../../api/api';

const useSaveTransactions = (
  {
    transactions, setTransactions, dispatch, store,
  },
  delay,
) => {
  const [debounced, setDebounced] = useState([]);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(transactions), delay);
    return () => {
      clearTimeout(handler);
    };
  }, [transactions]);

  useEffect(() => {
    let ignore = false;
    if (debounced.length) {
      const saveService = async () => {
        const result = await api.meta.saveTransactions(debounced);
        if (result.error) {
          dispatch(store.actions.error(result.error));
        }
        setTransactions([]);
      };

      if (!ignore) saveService();
    }
    return () => {
      ignore = true;
    };
  }, [debounced]);
};

const backgroundServices = {
  useSaveTransactions,
};

const createTransaction = (operations) => ({
  id: uuidv4(),
  operations,
});

const transactions = {
  createTransaction,
  backgroundServices,
};

export default transactions;
