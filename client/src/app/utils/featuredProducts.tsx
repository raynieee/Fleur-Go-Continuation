import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/components/ui/card'; // Adjust the import path accordingly

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string; // Assuming optional image property
}

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  return (
    <section className="px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card key={product.id} className="product bg-white shadow-lg rounded-lg overflow-hidden">
            <img src={product.image || '/default-image.jpg'} alt={product.name} className="w-full h-48 object-cover" />
            <CardHeader className="p-4">
              <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
              <CardDescription className="mt-2 text-gray-500">${product.price}</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {/* Additional content can go here */}
            </CardContent>
            <CardFooter className="p-4 flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add to Cart</button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
