//all product details for customers
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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  quantity: number; 
  has_discount?: boolean | null; 
  dummy_price?: number | null; 
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
  const [activeTab, setActiveTab] = useState(0);

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
        setQuantity(1); 
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  //handle add to cart logic including quantity validation
const handleAddToCart = async () => {
  if (!product) return;

  try {
    const response = await fetch('/api/cart', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Please login first');
    }

    const cartData = await response.json();
  
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
  //warranty and care info strings
const WARRANTY_INFO = `
All locally manufactured solid wood products will have a warranty of 2 years against poor quality of timber and manufacturing defects.

All locally manufactured PVC and fabric sofa sets will have a warranty for 2 years on the timber frame.

All furniture manufactured in melamine, plywood, veneer, MDF or any other material will have a warranty of 2 year against manufacturing defects other than solid wood.

Granite and quartz worktops will have a warranty of 2 year.

Payment receipt also serves as your warranty card. Warranty period will start from the date of purchase. Please retain the paymenet receipt and present it to claim warranty services if needed.
`;

const FURNITURE_CARE_INFO = `
Wood furniture is best maintained at temperatures between 22°C and 30°C. Relative humidity should be at 50% – 60%. 

Avoid prolonged exposure to heating and cooling outlets, as exposure to extreme temperature variations can damage any fine wood piece.

Do not expose furniture to continuous direct sunlight. With extended exposure, ultraviolet rays can create hairline cracks in the finish or cause fading, yellowing, or darkening. 

Wood is porous. It responds to extremely dry air by losing moisture and shrinking. It responds to humid air by absorbing moisture and expanding. In dry environments, the halves of an extension table may part slightly, especially at the edges. This will correct itself as the relative humidity rises and the wood absorbs enough moisture to expand. 

During humid weather, wood drawer fronts may swell and become difficult to open and close. These natural changes do not affect the furniture’s overall quality or durability. 
`;

const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {//handle tab change for warranty info
  setActiveTab(newValue);
};

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
   {product.has_discount && product.dummy_price !== null && product.dummy_price !== undefined ? (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          textDecoration: 'line-through',
          color: 'text.secondary'
        }}
      >
         Rs.{Number(product.dummy_price ?? 0).toFixed(2)}
      </Typography>
      <Typography 
        variant="h4" 
        color="error.main"
        sx={{ fontWeight: 'bold' }}
      >
         Rs.{Number(product.price ?? 0).toFixed(2)}
      </Typography>
      <Chip 
        label={`${Math.round((1 - product.price/product.dummy_price) * 100)}% OFF`} 
        color="error" 
        size="medium"
      />
    </Box>
  ) : (
    `Rs.${Number(product.price ?? 0).toFixed(2)}`
  )}
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
      {/* Warranty and care info tabs */}
      <Box sx={{ mt: 4, maxWidth: "lg", mx: 'auto',backgroundColor: 'background.paper' }}>
  <Tabs 
    value={activeTab} 
    onChange={handleTabChange}
    sx={{
      '& .MuiTabs-flexContainer': {
        justifyContent: 'center',
      }
    }}
  >
    <Tab label="Warranty" />
    <Tab label="Care Instructions" />
  </Tabs>
  
  <Box sx={{ 
    p: 3,
    border: 1,
    borderColor: 'divider',
    borderTop: 0,
    borderRadius: '0 0 4px 4px',
    minHeight: 200
  }}>
    {activeTab === 0 && (
      <Typography whiteSpace="pre-line" sx={{ fontSize: '1.1rem' }}>
        {WARRANTY_INFO}
      </Typography>
    )}
    {activeTab === 1 && (
      <Typography whiteSpace="pre-line" sx={{ fontSize: '1.1rem' }}>
        {FURNITURE_CARE_INFO}
      </Typography>
    )}
  </Box>
</Box>


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
