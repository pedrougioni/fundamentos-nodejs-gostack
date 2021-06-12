import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = { income: 0, outcome: 0, total: 0 };
    this.transactions.reduce((oldBalance: Balance, transaction) => {
      const newBalance = oldBalance;
      newBalance[transaction.type] += transaction.value;
      return newBalance;
    }, balance);
    balance.total = balance.income - balance.outcome;
    return balance;
  }

  public create({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    const transaction = new Transaction({ title, type, value });

    if (transaction.type === 'outcome') {
      const balance = this.getBalance();
      if (balance.total < transaction.value) {
        throw Error('You have no balance for this transaction.');
      }
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
