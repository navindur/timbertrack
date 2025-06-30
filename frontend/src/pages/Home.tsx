import React from 'react';
import HeroSection from '../components/HeroSection';
import BrowseTheRange from '../components/BrowseTheRange';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <BrowseTheRange />
      <Footer />
    </div>
  );
};

export default Home;