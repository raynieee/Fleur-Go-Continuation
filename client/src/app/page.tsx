"use client"
import Header from '@/app/utils/Header';
import FeaturedProducts from '@/app/utils/featuredProducts';
import Footer from '@/app/utils/footer';

// Mock data for demonstration purposes
const products = [
  { id: 1, image: '/path/to/image1.jpg', name: 'Product 1', price: 29.99 },
  { id: 2, image: '/path/to/image2.jpg', name: 'Product 2', price: 19.99 },
];

const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <FeaturedProducts products={products} />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
