import { useEffect, useState } from 'react';
import api from '../../../api/api';

const useSaveTransactions = (transactions, delay) => {
  const [debounced, setDebounced] = useState([]);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(transactions), delay);
    return () => {
      clearTimeout(handler);
    };
  }, [transactions]);

  const [transactionResult, setTransactionResult] = useState(null);
  useEffect(() => {
    let ignore = false;
    if (debounced.length) {
      const saveService = async () => {
        const result = await api.meta.saveTransactions(debounced);
        setTransactionResult(result);
      };

      if (!ignore) saveService();
    }
    return () => {
      ignore = true;
    };
  }, [debounced]);

  return transactionResult;
};

export default useSaveTransactions;
