import React from 'react';
import HeroSection from '../components/HeroSection';
import BrowseTheRange from '../components/BrowseTheRange';
import OurProducts from '../components/OurProducts'; 
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <BrowseTheRange />
      <OurProducts /> 
      <Footer />
      {/* Add more sections here later */}
    </div>
  );
};

export default Home;