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
  Chip
} from '@mui/material';
import { Search, ShoppingCart } from '@mui/icons-material';
import { getCustomerProducts, getCustomerProductById } from '../services/customerproductService';
import { Product } from '../types/product';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const CustomerProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getCustomerProducts({
          page: 1,
          limit: 100, // Adjust based on your needs
          search: searchTerm,
          category: categoryFilter
        });
        
        setProducts(data);
        setFilteredProducts(data);
        
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
  }, [searchTerm, categoryFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: any) => {
    setCategoryFilter(e.target.value);
  };

  const handleAddToCart = (productId: number) => {
    // Implement cart functionality
    console.log('Added to cart:', productId);
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
                      Rs.{
    product.price !== undefined && !isNaN(Number(product.price))
      ? Number(product.price).toFixed(2)
      : '0.00'
  }
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
              {searchTerm ? 'No products match your search' : 'No products available'}
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
              }}
            >
              Clear filters
            </Button>
          </Box>
        )}
      </Box>

      <Footer />

    </Box>
  );
};

export default CustomerProductList;