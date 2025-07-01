//show category wise divided products to customer
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Button,
  CircularProgress,
  Pagination,
  TextField,
  InputAdornment,
    Alert,
  Snackbar
} from '@mui/material';
import { ShoppingCart, Search } from '@mui/icons-material';
import { fetchCategoryProducts } from '../services/categoryServices';
import { Product } from '../types/Product';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom'; 
import { addToCart } from '../services/cartService'; 
const CategoryPage = () => {
  const { category } = useParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]); 
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 12;
  const navigate = useNavigate(); 
   //snackbar state for feedback messages
   const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
      });
      const [hideOutOfStock, setHideOutOfStock] = useState(false);


useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const result = await fetchCategoryProducts(category!, page, limit);
        setAllProducts(result.products);
        setFilteredProducts(result.products); 
        setTotalPages(result.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [category, page]);      

      

 useEffect(() => {
  const filtered = allProducts.filter(product => {
    const matchesSearch = searchTerm.trim() === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
   
    const inStock = !hideOutOfStock || 
      (product.quantity !== undefined && product.quantity > 0);
    
    return matchesSearch && inStock;
  });
  
  setFilteredProducts(filtered);
  setPage(1);
}, [searchTerm, allProducts, hideOutOfStock]);

  const handleAddToCart = async (productId: number) => {
  try {
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

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

    const cartResponse = await fetch('/api/cart', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (!cartResponse.ok) {
      throw new Error('Please login first');
    }

    const cartData = await cartResponse.json();
    
    let cartItems = [];
    if (Array.isArray(cartData)) {
      cartItems = cartData;
    } else if (cartData?.cartItems) {
      cartItems = cartData.cartItems;
    } else if (cartData?.items) {
      cartItems = cartData.items;
    }
//check if product is already in cart and prevent exceeding stock
    const existingCartItem = cartItems.find((item: any) => 
      item.product_id === productId || item.id === productId
    );

    const currentQty = existingCartItem?.quantity || 0;
    const requestedQty = 1; 
    const totalQty = currentQty + requestedQty;

    if (totalQty > product.quantity) {
      alert(`Cannot add to cart. You already have ${currentQty} in your cart, and only ${product.quantity} available.`);
      return;
    }

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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };


  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: '#f5f5f5'
    }}>
      <Navbar />
      
      <Box sx={{ 
        flexGrow: 1,
        p: 3,
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
       
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 4,
          gap: 2
        }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              {category && `${category.charAt(0).toUpperCase()}${category.slice(1).toLowerCase()} `} Products
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {filteredProducts.length} products available
              {searchTerm && ` matching "${searchTerm}"`}
            </Typography>
          </Box>
          
          <TextField
            placeholder="Search products..."
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
            sx={{
              width: { xs: '100%', sm: '300px' },
              bgcolor: 'background.paper'
            }}
          />
           <Button
      variant={hideOutOfStock ? "contained" : "outlined"}
      onClick={() => setHideOutOfStock(!hideOutOfStock)}
      size="small"
      sx={{ whiteSpace: 'nowrap' }}
    >
      {hideOutOfStock ? 'Showing In Stock only' : 'Click to remove out of Stock'}
    </Button>
        </Box>

        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Box 
                onClick={() => navigate(`/productsview/${product.id}`)} 
                sx={{ 
                  cursor: 'pointer',
                  height: '100%' 
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
              {searchTerm 
                ? `No products found matching "${searchTerm}"`
                : 'No products found in this category'}
            </Typography>
            {searchTerm && (
              <Button 
                variant="outlined" 
                onClick={() => setSearchTerm('')}
              >
                Clear search
              </Button>
            )}
          </Box>
        )}

        {!searchTerm && totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
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

export default CategoryPage;