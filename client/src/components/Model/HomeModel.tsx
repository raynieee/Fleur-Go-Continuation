import React from 'react';
import { Modal } from '@/components/ui/modal'; // Assuming you have a Modal component

const HomeModal = () => {
  return (
    <Modal
      title="Your eCommerce Store"
      description="Discover our latest collections and exclusive offers."
      isOpen={true} // Assuming this modal is always open for the homepage
      onClose={() => {}}
    >
      {/* Navigation Bar */}
      <nav className="bg-gray-800 p-4">
        {/* Logo and Branding */}
        <div className="flex justify-between items-center">
          <a href="/" className="text-white text-lg">BrandName</a>
          {/* Navigation Links */}
          <ul className="flex space-x-4">
            <li><a href="/products" className="text-white hover:text-gray-300">Products</a></li>
            <li><a href="/about" className="text-white hover:text-gray-300">About Us</a></li>
            <li><a href="/contact" className="text-white hover:text-gray-300">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Featured Products Section */}
      <section className="p-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Repeat this card for each featured product */}
          <div className="max-w-sm rounded overflow-hidden shadow-lg">
            <img className="w-full" src="path/to/image.jpg" alt="Product Image" />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Product Name</div>
              <p className="text-gray-700 text-base">$99.99</p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <button className="inline-block bg-blue-500 rounded-full px-6 py-2 text-white font-semibold">Buy Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-red-600 text-white p-8">
        <h2 className="text-3xl font-bold mb-4">Limited Time Offer!</h2>
        <p className="mb-4">Get 20% off on all orders over $100.</p>
        <button className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200">Shop Now</button>
      </section>
    </Modal>
  );
};

export default HomeModal;
