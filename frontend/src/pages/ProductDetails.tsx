import React from 'react';
import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';

// Sample product data (replace with actual data fetching logic)
const products = [
  {
    id: 1,
    name: 'Syltherine',
    description: 'Stylish coile chain',
    price: 'Rs. 2,500,000',
    image: '/syltherine.jpg',
    specifications: {
      dimensions: '200cm x 100cm x 80cm',
      material: 'Wood, Metal',
      color: 'Black',
    },
  },
  {
    id: 2,
    name: 'Lolito',
    description: 'Luxury big solo',
    price: 'Rs. 7,000,000',
    image: '/lolito.jpg',
    specifications: {
      dimensions: '150cm x 80cm x 60cm',
      material: 'Leather, Metal',
      color: 'Brown',
    },
  },
  // Add other products...
];

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get product ID from URL

  // Find the product based on the ID
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <div>Product not found</div>; // Handle case where product is not found
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Product Image */}
        <div
          className="w-full h-96 bg-cover bg-center rounded-lg mb-8"
          style={{ backgroundImage: `url('${product.image}')` }}
        ></div>

        {/* Product Details */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-2xl font-semibold text-[#C24507]">{product.price}</p>

          {/* Add to Cart Button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#C24507',
              color: '#FFFFFF',
              fontSize: '1rem',
              padding: '12px 24px',
              '&:hover': {
                backgroundColor: '#A63A06',
              },
            }}
          >
            Add to Cart
          </Button>

          {/* Product Specifications */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Specifications</h2>
            <div className="space-y-2">
              <p><strong>Dimensions:</strong> {product.specifications.dimensions}</p>
              <p><strong>Material:</strong> {product.specifications.material}</p>
              <p><strong>Color:</strong> {product.specifications.color}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;