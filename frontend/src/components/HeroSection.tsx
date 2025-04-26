import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';



const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-cover bg-center h-[500px] flex items-center justify-center text-black"
      style={{ backgroundImage: "url('/scandinavian-interior-mockup-wall-decal-background 1.png')" }} // Add your background image
    >
      <div className="bg-[rgba(205,134,63,0.36)] p-8 rounded-lg text-center max-w-2xl">
        {/* Heading */}
        <h1 className="text-4xl font-bold mb-4">New Arrival</h1>

        {/* Subheading */}
        <h2 className="text-6xl font-bold mb-6">Discover Our New Collection</h2>

        {/* Description */}
        <p className="text-xl mb-8">
          Come visit us and find out world best furniture, select what you like, own them as you like.
        </p>

        {/* Call-to-Action Button */}
        <Button
  variant="contained"
  sx={{
    backgroundColor: '#B88E2F',
    color: '#FFFFFF',
    fontSize: '1rem',
    padding: '12px 24px',
    '&:hover': {
      backgroundColor: '#A63A06',
    },
  }}
  onClick={() => navigate('/products')} // 👈 Redirects to /products
>
  BUY NOW
</Button>
      </div>
    </div>
  );
};

export default HeroSection;