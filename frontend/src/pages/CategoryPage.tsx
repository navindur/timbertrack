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
  InputAdornment
} from '@mui/material';
import { ShoppingCart, Search } from '@mui/icons-material';
import { fetchCategoryProducts } from '../services/categoryServices';
import { Product } from '../types/product';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const CategoryPage = () => {
  const { category } = useParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Store all products
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Store filtered products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 12;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const result = await fetchCategoryProducts(category!, page, limit);
        setAllProducts(result.products);
        setFilteredProducts(result.products); // Initialize filtered products
        setTotalPages(result.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [category, page]);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(allProducts);
      setPage(1); // Reset to first page when clearing search
    } else {
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
      setPage(1); // Reset to first page when searching
    }
  }, [searchTerm, allProducts]);

  const handleAddToCart = (productId: number) => {
    console.log('Added to cart:', productId);
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

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
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
        {/* Category Header and Search */}
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
        </Box>

        {/* Product Grid */}
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description || 'No description available'}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Chip 
                      label={product.category || 'Uncategorized'} 
                      color="primary" 
                      size="small" 
                    />
                    <Typography variant="h6">
                      Rs. {product.price !== undefined && !isNaN(Number(product.price))
                        ? Number(product.price).toFixed(2)
                        : '0.00'}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<ShoppingCart />}
                    onClick={() => product.id && handleAddToCart(product.id)}
                    fullWidth
                    variant="contained"
                    sx={{
                      bgcolor: '#3b82f6',
                      '&:hover': { bgcolor: '#2563eb' }
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

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

        {/* Pagination - Only show if not searching */}
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
    </Box>
  );
};

export default CategoryPage;