import { v4 as uuidv4 } from 'uuid';

const createTransaction = (operations) => ({
  id: uuidv4(),
  operations,
});

const transactions = {
  createTransaction,
};

export default transactions;
