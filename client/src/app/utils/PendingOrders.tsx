import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Transaction interface based on your model
interface Transaction {
  id: number;
  userId: string;
  shopId: number;
  cartItemId: number;
  amount: number;
  createdAt: string;
  status: string;
}

const CompletedOrdersCard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState({
    userId: '',
    shopId: 0,
    cartItemId: 0,
    amount: 0,
    status: '',
  });

  useEffect(() => {
    const fetchCompletedTransactions = async () => {
      try {
        const response = await axios.get('/api/transactions/completed');
        setTransactions(response.data);
      } catch (error) {
        console.error('Failed to fetch completed transactions:', error);
      }
    };

    fetchCompletedTransactions();
  }, []);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
    setNewTransaction({
      userId: '',
      shopId: 0,
      cartItemId: 0,
      amount: 0,
      status: '',
    });
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    const index = transactions.findIndex(t => t.id === updatedTransaction.id);
    if (index!== -1) {
      const updatedTransactions = [...transactions];
      updatedTransactions[index] = updatedTransaction;
      setTransactions(updatedTransactions);
    }
  };

  const handleDeleteTransaction = (transactionId: number) => {
    const updatedTransactions = transactions.filter(t => t.id!== transactionId);
    setTransactions(updatedTransactions);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingTransaction) {
      handleUpdateTransaction(editingTransaction);
      setEditingTransaction(null);
    } else {
      handleAddTransaction(newTransaction);
    }
  };

  const handleChange = (field: keyof typeof newTransaction) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTransaction(prevState => ({...prevState, [field]: event.target.value }));
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Completed Orders</h2>
      <ul className="list-disc pl-5">
        {transactions.map(transaction => (
          <li key={transaction.id} className="flex justify-between items-center mb-4">
            <span>{`Amount: ${transaction.amount}, Status: ${transaction.status}`}</span>
            <div className="flex space-x-2">
              <button onClick={() => setEditingTransaction(transaction)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button>
              <button onClick={() => handleDeleteTransaction(transaction.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {editingTransaction && (
        <form onSubmit={handleSubmit} className="mt-6">
          {/* Form fields for editing a transaction */}
        </form>
      )}
      {!editingTransaction && (
        <form onSubmit={handleSubmit} className="mt-6">
          {/* Form fields for adding a new transaction */}
        </form>
      )}
    </div>
  );
};

export default CompletedOrdersCard;