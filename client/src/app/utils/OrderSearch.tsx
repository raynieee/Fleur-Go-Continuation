import React, { useState } from 'react';

// Define the type for the search parameters
interface SearchParams {
  keyword?: string;
  dateOrder?: 'newest' | 'oldest';
}

// Adjust the OrderSearch component to accept setSearchResult as a prop
interface OrderSearchProps {
  setSearchResult: React.Dispatch<React.SetStateAction<SearchParams>>;
}

const OrderSearch: React.FC<OrderSearchProps> = ({ setSearchResult }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({});

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({
     ...prevParams,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchResult(searchParams);
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <span className="font-semibold">Order Search</span>
      </div>
      <form onSubmit={handleSubmit} className="flex items-center space-x-4">
        <input
          type="text"
          name="keyword"
          placeholder="Keyword..."
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-2"
        />
        <select
          name="dateOrder"
          placeholder="Date Order..."
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-2 ml-2"
        >
          <option value="">All</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Search</button>
      </form>
    </nav>
  );
};

export default OrderSearch;
