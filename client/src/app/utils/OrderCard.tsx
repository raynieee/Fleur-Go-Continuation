import React from 'react';

// Define the type for a single line item
interface LineItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  // Add other properties as needed
}

// Define the OrderCard component
const OrderCard: React.FC<{ lineItems: LineItem[]; onRemoveOrder: (id: number) => void }> = ({ lineItems, onRemoveOrder }) => {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-2">
      {lineItems.map((item) => (
        <div key={item.id} className="p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="h-12 w-12" src="/path/to/logo.png" alt="Logo"/>
            </div>
            <div className="ml-4">
              <div className="font-medium text-gray-900">{item.name}</div>
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              <p className="text-sm text-gray-500">Price: $ {item.price.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-4">
            <button onClick={() => onRemoveOrder(item.id)} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderCard;
