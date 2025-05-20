// src/pages/CustomerProductList.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
    Alert,
  Snackbar
} from '@mui/material';
import { Search, ShoppingCart } from '@mui/icons-material';
import { getCustomerProducts, getCustomerProductById } from '../services/customerproductService';
import { Product } from '../types/product';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom'; //new
import { addToCart } from '../services/cartService'; // new

const CustomerProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate(); //new
  const [snackbar, setSnackbar] = useState({
      open: false,
      message: '',
      severity: 'success' as 'success' | 'error'
    });
    const [hideOutOfStock, setHideOutOfStock] = useState(false);


  useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getCustomerProducts({
        page: 1,
        limit: 100,
        search: searchTerm,
        category: categoryFilter,
        
      });
      
      setProducts(data);
      
      // Apply all filters including out-of-stock
      let filtered = [...data];
      if (hideOutOfStock) {
  filtered = filtered.filter(product => 
    product.quantity !== undefined && product.quantity > 0
  );
}
      if (searchTerm) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (categoryFilter) {
        filtered = filtered.filter(product => 
          product.category === categoryFilter
        );
      }
      
      setFilteredProducts(filtered);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data.map(product => product.category))
      ).filter(Boolean) as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [searchTerm, categoryFilter, hideOutOfStock]); // Add hideOutOfStock to dependencies

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: any) => {
    setCategoryFilter(e.target.value);
  };

const handleAddToCart = async (productId: number) => {
  try {
    // Find the product in our local state
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if product is out of stock
    if (product.quantity === undefined) {
  throw new Error('Product quantity not available');
}

if (product.quantity <= 0) {
  setSnackbar({
    open: true,
    message: 'This product is out of stock',
    severity: 'error'
  });
  return;
}


    // Fetch current cart items
    const cartResponse = await fetch('/api/cart', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (!cartResponse.ok) {
      throw new Error('Please login first');
    }

    const cartData = await cartResponse.json();
    
    // Handle different possible cart response formats
    let cartItems = [];
    if (Array.isArray(cartData)) {
      cartItems = cartData;
    } else if (cartData?.cartItems) {
      cartItems = cartData.cartItems;
    } else if (cartData?.items) {
      cartItems = cartData.items;
    }

    // Find existing item in cart
    const existingCartItem = cartItems.find((item: any) => 
      item.product_id === productId || item.id === productId
    );

    // Calculate total quantity that would be in cart after adding
    const currentQty = existingCartItem?.quantity || 0;
    const requestedQty = 1; // We're adding 1 item
    const totalQty = currentQty + requestedQty;

    // Validate against available inventory
    if (totalQty > product.quantity) {
      alert(`Cannot add to cart. You already have ${currentQty} in your cart, and only ${product.quantity} available.`);
      return;
    }

    // If validation passes, add to cart
    await addToCart(productId, requestedQty);
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
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };


  return (
    
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100vw',
      bgcolor: '#f5f5f5'
      
    }}>
    
    <Navbar />

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1,
        p: 3,
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',  // Changed from row to column
  alignItems: 'center',    // Center align items
  mb: 4,
  gap: 2 
        }}>
       
          {/* Search and Filter */}
          <Box sx={{ display: 'flex', gap: 2,  width: '100%',  justifyContent: 'flex-start' }}>
            <TextField
              placeholder="Search products"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={handleCategoryChange}
                label="Category"
              >
                <MenuItem value="">All</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
    variant={hideOutOfStock ? "contained" : "outlined"}
    onClick={() => setHideOutOfStock(!hideOutOfStock)}
    size="small"
    sx={{ ml: 'auto' }}
  >
    {hideOutOfStock ? 'Showing In Stock Only' : 'Click to remove out of Stock'}
  </Button>
          </Box>
        </Box>

        {/* Product Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
  {filteredProducts.map((product) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
      <Box 
        onClick={() => navigate(`/productsview/${product.id}`)} 
        sx={{ 
          cursor: 'pointer',
          height: '100%' // Ensure the Box takes full height
        }}
      >
        <Card sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: 3
          }
        }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image_url || '/placeholder-product.jpg'}
                    alt={product.name}
                    sx={{ objectFit: 'contain', p: 1 }}
                  />
   <CardContent sx={{ flexGrow: 1 }}>
  <Typography gutterBottom variant="h6" component="div">
    {product.name}
  </Typography>
  
  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
    <Chip 
      label={product.category || 'Uncategorized'} 
      color="primary" 
      size="small" 
    />
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      {product.has_discount && product.dummy_price ? (
        <>
          <Typography 
            variant="body1" 
            sx={{ 
              textDecoration: 'line-through',
              color: 'text.secondary',
              fontSize: '0.875rem'
            }}
          >
            
            Rs.{Number(product.dummy_price ?? 0).toFixed(2)}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'error.main',
              fontWeight: 'bold'
            }}
          >
            Rs.{Number(product.price ?? 0).toFixed(2)}
          </Typography>
          <Chip 
            label={`${Math.round((1 - product.price/product.dummy_price) * 100)}% OFF`} 
            color="error" 
            size="small"
            sx={{ mt: 0.5 }}
          />
        </>
      ) : (
        <Typography variant="h6">
         Rs.{Number(product.price ?? 0).toFixed(2)}
        </Typography>
      )}
    </Box>
  </Box>
</CardContent>
               
                  <CardActions>
                  <Button 
    size="small" 
    startIcon={<ShoppingCart />}
    onClick={(e) => {
      e.stopPropagation();
      product.id && handleAddToCart(product.id);
    }}
    fullWidth
    variant="contained"
    disabled={product.quantity !== undefined && product.quantity <= 0}
    sx={{
      bgcolor: '#3b82f6',
      '&:hover': { bgcolor: '#2563eb' },
      '&:disabled': {
        bgcolor: 'grey.300',
        color: 'grey.600'
      }
    }}
  >
    {product.quantity !== undefined && product.quantity <= 0 
      ? 'Out of Stock' 
      : 'Add to Cart'}
  </Button>

                  </CardActions>
                </Card>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State */}
       {!loading && filteredProducts.length === 0 && (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    mt: 4,
    p: 4,
    textAlign: 'center'
  }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      {hideOutOfStock 
        ? 'No in-stock products match your criteria' 
        : searchTerm 
          ? 'No products match your search' 
          : 'No products available'}
    </Typography>
    <Button 
      variant="outlined" 
      onClick={() => {
        setSearchTerm('');
        setCategoryFilter('');
        setHideOutOfStock(false);
      }}
    >
      Clear all filters
    </Button>
  </Box>
)}
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

export default CustomerProductList;