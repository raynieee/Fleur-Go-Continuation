import React, { useState, useEffect } from 'react';

interface Bouquet {
  id: number;
  name: string;
  description: string;
}

const BouquetManager: React.FC = () => {
  const [bouquets, setBouquets] = useState<Bouquet[]>([]);
  const [editingBouquet, setEditingBouquet] = useState<Bouquet | null>(null);
  const [newBouquet, setNewBouquet] = useState<{ name: string; description: string }>({ name: '', description: '' });

  useEffect(() => {
    const fetchedBouquets = [
      { id: 1, name: 'Rose Bouquet', description: 'A beautiful rose bouquet' },
      { id: 2, name: 'Tulip Bouquet', description: 'Fresh tulips arranged beautifully' },
    ];
    setBouquets(fetchedBouquets);
  }, []);

  const addBouquet = (newBouquet: Bouquet) => {
    setBouquets([...bouquets, newBouquet]);
    setNewBouquet({ name: '', description: '' }); // Clear the new bouquet form
  };

  const updateBouquet = (updatedBouquet: Bouquet) => {
    const index = bouquets.findIndex(b => b.id === updatedBouquet.id);
    if (index!== -1) {
      const updatedBouquets = [...bouquets];
      updatedBouquets[index] = updatedBouquet;
      setBouquets(updatedBouquets);
    }
  };

  const deleteBouquet = (bouquetId: number) => {
    const updatedBouquets = bouquets.filter(b => b.id!== bouquetId);
    setBouquets(updatedBouquets);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingBouquet) {
      updateBouquet(editingBouquet);
      setEditingBouquet(null);
    } else {
      addBouquet({ id: Date.now(), name: newBouquet.name, description: newBouquet.description });
    }
  };

  const handleChange = (field: keyof typeof newBouquet) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewBouquet(prevState => ({...prevState, [field]: event.target.value }));
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Inventory Manager</h2>
      <ul className="list-disc pl-5">
        {bouquets.map(bouquet => (
          <li key={bouquet.id} className="flex justify-between items-center mb-4">
            <span>{`${bouquet.name} - ${bouquet.description}`}</span>
            <div className="flex space-x-2">
              <button onClick={() => setEditingBouquet(bouquet)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button>
              <button onClick={() => deleteBouquet(bouquet.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {editingBouquet && (
        <form onSubmit={handleSubmit} className="mt-6">
          {/* Existing form fields */}
        </form>
      )}
      {!editingBouquet && (
        <form onSubmit={handleSubmit} className="mt-6">
          <input value={newBouquet.name} onChange={handleChange('name')} placeholder="Bouquet Name" required className="block w-full p-2 mb-2 border border-gray-300 rounded" />
          <textarea value={newBouquet.description} onChange={handleChange('description')} placeholder="Description" required className="block w-full p-2 mb-2 border border-gray-300 rounded"></textarea>
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Add New Bouquet</button>
        </form>
      )}
    </div>
  );
};

export default BouquetManager;
