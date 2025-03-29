import React from 'react';
import { 
  Box, 
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Stack,
  Pagination,
  Select,
  MenuItem,
  InputAdornment,
  TextField
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add'; // New import
import SearchHeader from '../components/SearchHeader';
import Navbar from '../components/Adminnavbar';

const ProductsDashboard = () => {
  // Sample data
  const products = [
    { id: 1, name: 'Chart Big in Chairs', stock: 'IOT in stock', price: 'Rs. 24,999', status: '321,UWEATT', action: 'PUBLISHED' },
    { id: 2, name: 'Chart Big in Chairs', stock: 'IOT in stock', price: 'Rs. 24,999', status: '321,UWEATT', action: 'PUBLISHED' },
    { id: 3, name: 'Chart Big in Chairs', stock: 'IOT in stock', price: 'Rs. 24,999', status: '321,UWEATT', action: 'PUBLISHED' },
    { id: 4, name: 'Chart Big in Chairs', stock: 'IOT in stock', price: 'Rs. 24,999', status: '321,UWEATT', action: 'PUBLISHED' },
  ];

  const handleAddProduct = () => {
    // Add your logic for adding a new product here
    console.log('Add new product clicked');
    // This would typically open a modal/dialog or navigate to a new page
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Navbar - Fixed width */}
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <Navbar />
      </Box>

      {/* Main Content - Takes remaining space */}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 3,
        ml: { sm: '240px' },
        width: { sm: `calc(100% - 240px)` }
      }}>
        {/* Search Header */}
        <SearchHeader 
          userName="Navindu"
          onSearchChange={(value) => console.log(value)}
        />

        {/* Page Title and Add Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Products
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                backgroundColor: 'primary.dark'
              }
            }}
          >
            Add New Product
          </Button>
        </Box>

        {/* Search Section */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Search by product name
          </Typography>
          <TextField
            size="small"
            placeholder="Search products..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <Chip label="No filters applied" variant="outlined" />
        </Stack>

        {/* Products Table */}
        <Paper elevation={3} sx={{ mb: 3, overflow: 'auto' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>NAME</strong></TableCell>
                  <TableCell><strong>STOCK</strong></TableCell>
                  <TableCell><strong>PRICE</strong></TableCell>
                  <TableCell><strong>STATUS</strong></TableCell>
                  <TableCell><strong>ACTIONS</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography sx={{ color: 'text.secondary' }}>›</Typography>
                        <Typography>{product.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>
                      <Chip label={product.status} size="small" color="primary" />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="text" sx={{ mr: 1 }}>
                        {product.action}
                      </Button>
                      <Button size="small">⋯</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Pagination */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center">
            <Typography variant="body2" sx={{ mr: 1 }}>
              Rows per page:
            </Typography>
            <Select
              size="small"
              value={4}
              sx={{ height: 30 }}
            >
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={12}>12</MenuItem>
            </Select>
          </Stack>
          <Typography variant="body2" sx={{ mr: 2 }}>
            4 of 4
          </Typography>
          <Pagination count={1} shape="rounded" />
        </Stack>
      </Box>
    </Box>
  );
};

export default ProductsDashboard;