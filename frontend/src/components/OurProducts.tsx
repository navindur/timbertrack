// src/components/OurProducts.tsx
import { useEffect, useState } from 'react';
import { Product } from '../types/Product';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Skeleton,
  Chip,
} from '@mui/material';

const OurProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products/recent');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (error) return (
    <div className="text-center p-8 text-red-500">
      Error loading products: {error}
    </div>
  );

  return (
    <section className="container mx-auto px-4 py-12">
      <Typography variant="h4" component="h2" className="text-center mb-8 font-bold">
        Our Products
      </Typography>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="h-full">
              <Skeleton variant="rectangular" height={140} />
              <CardContent>
                <Skeleton variant="text" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </CardContent>
            </Card>
          ))
        ) : (
          products.map((product) => (
            <Card key={product.id} className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="h-full flex flex-col">
                <Typography variant="h6" component="h3" className="mb-2">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mb-4 flex-grow">
                  {product.description}
                </Typography>
                <Typography variant="h6" className="mb-2">
                  ${product.price.toFixed(2)}
                </Typography>
                <div className="mt-auto space-x-2">
                  {product.category && (
                    <Chip label={product.category} size="small" className="text-xs" />
                  )}
                  {product.material && (
                    <Chip label={product.material} size="small" className="text-xs" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="text-center mt-8">
        <Button
          component={Link}
          to="/products"
          variant="contained"
          size="large"
          className="bg-blue-600 hover:bg-blue-700"
        >
          Show More
        </Button>
      </div>
    </section>
  );
};

export default OurProducts;