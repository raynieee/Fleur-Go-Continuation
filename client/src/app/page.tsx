"use client"
import Header from '@/app/utils/Header';
import FeaturedProducts from '@/app/utils/featuredProducts';
import Footer from '@/app/utils/footer';

const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <FeaturedProducts/>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
