import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  Chip,
  Container
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';


interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  quantity: number;
}

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/productview/${id}`);
        
        if (!response.ok) {
          throw new Error(response.status === 404 
            ? 'Product not found' 
            : 'Failed to fetch product');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      console.log('Added to cart:', product.id);
      // Implement your cart logic here
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h5" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: '#f5f5f5'
    }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        

        {product && (
          <Card sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            p: 3
          }}>
            <Box sx={{ flex: 1 }}>
              <CardMedia
                component="img"
                image={product.image_url || '/placeholder-product.jpg'}
                alt={product.name}
                sx={{ 
                  maxHeight: '500px',
                  width: '100%',
                  objectFit: 'contain',
                  borderRadius: 1
                }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <CardContent>
                <Typography gutterBottom variant="h4" component="h1">
                  {product.name}
                </Typography>
                
                <Chip 
                  label={product.category || 'Uncategorized'} 
                  color="primary" 
                  sx={{ mb: 2 }}
                />
                
               <Typography variant="h6">
                                     Rs.{
                   product.price !== undefined && !isNaN(Number(product.price))
                     ? Number(product.price).toFixed(2)
                     : '0.00'
                 }
                                     </Typography>

                <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                  {product.description || 'No description available'}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Available Quantity: {product.quantity}
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  sx={{
                    bgcolor: '#3b82f6',
                    '&:hover': { bgcolor: '#2563eb' }
                  }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Box>
          </Card>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default ProductDetailPage;