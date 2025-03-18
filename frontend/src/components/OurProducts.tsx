import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const OurProducts: React.FC = () => {
  // Sample product data
  const products = [
    {
      id: 1,
      name: 'Syltherine',
      description: 'Stylish coile chain',
      price: 'Rs. 2,500,000',
      image: '/Images.png', // Add your image path
    },
    {
      id: 2,
      name: 'Lolito',
      description: 'Luxury big solo',
      price: 'Rs. 7,000,000',
      image: '/Images.png', // Add your image path
    },
    {
      id: 3,
      name: 'Respira',
      description: 'Outdoor bar table and stool',
      price: 'Rs. 500,000',
      image: '/Images.png', // Add your image path
    },
    {
      id: 4,
      name: 'Potty',
      description: 'Minimalist Sofa',
      price: 'Rs. 500,000',
      image: '/Images.png', // Add your image path
    },
    {
      id: 5,
      name: 'Grifo',
      description: 'Night lamp',
      price: 'Rs. 1,500,000',
      image: '/Images.png', // Add your image path
    },
    {
      id: 6,
      name: 'Muggo',
      description: 'Small Solo',
      price: 'Rs. 150,000',
      image: '/Images.png', // Add your image path
    },
    {
      id: 7,
      name: 'Pingky',
      description: 'Cute bed set',
      price: 'Rs. 7,000,000',
      image: '/Images.png', // Add your image path
    },
    {
      id: 8,
      name: 'Potty',
      description: 'Minimalist solo',
      price: 'Rs. 500,000',
      image: '/Images.png', // Add your image path
    },
  ];

  return (
    <div className="text-center py-12">
      {/* Heading */}
      <h2 className="text-4xl font-bold mb-4">Our Products</h2>

      {/* Description */}
      <p className="text-lg text-gray-600 mb-12">
        Check all our available products
      </p>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-full rounded-lg overflow-hidden transform transition-transform hover:scale-105"
            style={{
              backgroundColor: 'white',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Product Image */}
            <div
              className="w-full h-64 bg-cover bg-center"
              style={{ backgroundImage: `url('${product.image}')` }}
            ></div>

            {/* Product Details */}
            <div className="p-4">
              <h3 className="text-xl font-bold text-black mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-lg font-semibold text-[#C24507]">{product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      <Button
        variant="outlined"
        sx={{
          color: '#C24507', // Timber orange
          borderColor: '#C24507',
          fontSize: '1rem',
          padding: '12px 24px',
          marginTop: '2rem',
          '&:hover': {
            backgroundColor: '#C24507', // Timber orange on hover
            color: '#FFFFFF', // White text on hover
          },
        }}
      >
        Show More
      </Button>
    </div>
  );
};

export default OurProducts;