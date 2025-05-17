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
  Container,
  TextField,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { ShoppingCart, Add, Remove } from '@mui/icons-material';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { addToCart } from '../services/cartService';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  quantity: number; // Available inventory
}

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

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
        setQuantity(1); // Reset quantity when product changes
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

const handleAddToCart = async () => {
  if (!product) return;

  try {
    // First fetch the current cart items for this product
    const response = await fetch('/api/cart', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart items');
    }

    const cartData = await response.json();
    
    // Handle different possible response formats
    let cartItems = [];
    if (Array.isArray(cartData)) {
      cartItems = cartData;
    } else if (cartData?.cartItems && Array.isArray(cartData.cartItems)) {
      cartItems = cartData.cartItems;
    } else if (cartData?.items && Array.isArray(cartData.items)) {
      cartItems = cartData.items;
    }

    const existingCartItem = cartItems.find((item: any) => item.product_id === product.id);
    const currentQuantityInCart = existingCartItem ? existingCartItem.quantity : 0;
    const totalRequestedQuantity = currentQuantityInCart + quantity;

    if (totalRequestedQuantity > product.quantity) {
      setSnackbar({
        open: true,
        message: `Cannot add to cart. You already have ${currentQuantityInCart} in your cart, and only ${product.quantity} available.`,
        severity: 'error'
      });
      return;
    }

    // If validation passes, add to cart
    await addToCart(product.id, quantity);
    setSnackbar({
      open: true,
      message: 'Product added to cart!',
      severity: 'success'
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    setSnackbar({
      open: true,
      message: error instanceof Error ? error.message : 'Failed to add to cart',
      severity: 'error'
    });
  }
};

  const handleQuantityChange = (newQuantity: number) => {
    if (!product) return;
    
    // Ensure quantity is within 1 and available inventory
    const validatedQuantity = Math.max(1, Math.min(newQuantity, product.quantity));
    setQuantity(validatedQuantity);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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
                
                <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
  Rs. {Number(product.price).toFixed(2)}
</Typography>


                <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                  {product.description || 'No description available'}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                    Available: {product.quantity}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton 
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Remove />
                    </IconButton>
                    
                    <TextField
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      type="number"
                      inputProps={{
                        min: 1,
                        max: product.quantity,
                        style: { textAlign: 'center' }
                      }}
                      sx={{
                        width: '80px',
                        mx: 1,
                        '& .MuiInputBase-input': {
                          padding: '8.5px 14px'
                        }
                      }}
                    />
                    
                    <IconButton 
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.quantity}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0}
                  sx={{
                    bgcolor: '#3b82f6',
                    '&:hover': { bgcolor: '#2563eb' }
                  }}
                >
                  {product.quantity === 0 ? 'Out of Stock' : `Add to Cart (${quantity})`}
                </Button>
              </CardContent>
            </Box>
          </Card>
        )}
      </Container>

      <Footer />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetailPage;