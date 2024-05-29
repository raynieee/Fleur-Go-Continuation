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

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Completed Orders</h2>
      <ul className="list-disc pl-5">
        {transactions.map(transaction => (
          <li key={transaction.id} className="flex justify-between items-center mb-4">
            <span>{`ID: ${transaction.id}, Amount: ${transaction.amount}, Status: ${transaction.status}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompletedOrdersCard;
