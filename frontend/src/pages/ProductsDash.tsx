import React, { useEffect, useState } from 'react';
import AddProductDialog from '../components/AddProductDialog';
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
import AddIcon from '@mui/icons-material/Add';
import SearchHeader from '../components/SearchHeader';
import Navbar from '../components/Adminnavbar';
import { getAllProducts, deleteProduct, addProduct } from '../services/productService';

const ProductsDash = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getAllProducts();
        setProducts(response.data); // Extract the data property from the response
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    setProducts(products.filter((product) => product.id !== id)); // Optimistic UI update
  };
  const handleAddProduct = async (newProduct: any) => {
    try {
      // You'll need to create an addProduct function in your productService
      const response = await addProduct(newProduct);
      setProducts([...products, response.data]);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };
  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden' 
    }}>
      <Box sx={{ 
        width: 240, 
        flexShrink: 0,
        position: 'fixed',
        height: '100vh'
      }}>
        <Navbar />
      </Box>

      <Box component="main" sx={{ 
        flexGrow: 1,
        p: 3,
        ml: '240px',  
        width: 'calc(100% - 240px)',
        minHeight: '100vh',
        boxSizing: 'border-box',
        bgcolor: '#efdecd'
      }}>
        <SearchHeader 
          userName="Navindu"
          onSearchChange={(value) => console.log(value)}
        />

        <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Products
            </Typography>
            <Button
  variant="contained"
  startIcon={<AddIcon />}
  sx={{
    backgroundColor: '#B88E2F',
    color: '#fff',
    borderRadius: '8px',
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#A63A06',
      boxShadow: 'none'
    }
  }}
  onClick={() => setDialogOpen(true)}
>
  Add New Product
</Button>
          </Box>

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

          <Paper elevation={3} sx={{ mb: 3, overflow: 'auto', width: '100%' }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>NAME</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>CATEGORY</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>PRICE</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>STOCK</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">Loading...</TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography sx={{ color: 'text.secondary' }}>›</Typography>
                            <Typography>{product.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{product.category_name}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.stock_quantity}</TableCell>
                        <TableCell>
                          <Chip label={product.is_active ? 'Active' : 'Inactive'} size="small" color={product.is_active ? 'primary' : 'default'} />
                        </TableCell>
                        <TableCell>
                          <Button size="small" variant="text" sx={{ mr: 1 }}>
                            ✏️ Edit
                          </Button>
                          <Button size="small" onClick={() => handleDelete(product.id)}>
                            🗑️ Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <AddProductDialog 
  open={dialogOpen}
  onClose={() => setDialogOpen(false)}
  onAddProduct={handleAddProduct}
/>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center">
              <Typography variant="body2" sx={{ mr: 1 }}>
                Rows per page:
              </Typography>
              <Select size="small" value={4} sx={{ height: 30 }}>
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
    </Box>
  );
};

export default ProductsDash;
