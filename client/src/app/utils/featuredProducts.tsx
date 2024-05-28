import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/components/ui/card'; // Adjust the import path accordingly

interface Product {
  id: number;
  name: string;
  price: number;
  bouquetImgUrl: string; // Assuming optional image property
  quantity: number;
  description: string;
}

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/bouquets');
        setProducts(response.data);
      } catch (error) {
        setError('Failed to fetch products.');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center p-5">Refreshing products...</div>;
  }

  if (error) {
    return <div className="text-center p-5">{error}</div>;
  }

  return (
    <section className="px-6 py-6">
      <h2 className="text-green-700 text-2xl font-bold mb-6">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="product bg-white shadow-lg rounded-lg overflow-hidden">
            <img src={product.bouquetImgUrl || '/default-image.jpg'} alt={product.name} className="w-full h-48 object-cover" />
            <CardHeader className="">
              <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
              <CardDescription className="text-gray-500">${product.price}</CardDescription>
              <CardDescription className="text-gray-700">Quantity: {product.quantity}</CardDescription>
            </CardHeader>
            <CardContent className="text-xs">
              {product.description}
            </CardContent>
            <CardFooter className="p-4 flex justify-end">
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-4 rounded">Add to Cart</button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
