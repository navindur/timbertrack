// src/pages/ProductList.tsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Box,
  Typography,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  SelectChangeEvent,
  Chip
} from '@mui/material';
import { Edit, Delete, Add, Search, Image as ImageIcon } from '@mui/icons-material';
import Navbar from '../components/Adminnavbar';
import { uploadImageToFirebase } from '../services/firebaseService';
import { 
    getAllProducts, 
    deleteProduct, 
    addProduct,
    getInventoryOptions,
    updateProduct
} from '../services/productService';
import { Product, InventoryOption } from '../types/product';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';


const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [inventoryOptions, setInventoryOptions] = useState<InventoryOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsData, inventoryData] = await Promise.all([
            getAllProducts({ page, limit, search: searchTerm, category: categoryFilter }),
          getInventoryOptions()
        ]);
        setProducts(productsData);
        setFilteredProducts(productsData);
        setInventoryOptions(inventoryData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch data',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [page, searchTerm, categoryFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: any) => {
    setCategoryFilter(e.target.value);
  };

  const handleOpenAddDialog = () => {
  setCurrentProduct({
    name: '',
    description: '',
    inventory_id: 0,
    image_url: '',
    price: 0, // Add default price
    has_discount: false, // Add default discount status
    dummy_price: null // Add default original price
  });
  setOpenDialog(true);
};

  const handleOpenEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProduct(null);
    setImageFile(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentProduct) return;
    setCurrentProduct({
      ...currentProduct,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
  if (!currentProduct) return;
  const inventoryId = Number(e.target.value);
  const selectedInventory = inventoryOptions.find(opt => opt.inventory_id === inventoryId);
  
  if (selectedInventory) {
    setCurrentProduct({
      ...currentProduct,
      inventory_id: inventoryId,
      name: selectedInventory.name,
      price: selectedInventory.price || 0, // Ensure price is always a number
      quantity: selectedInventory.quantity,
      category: selectedInventory.type,
      has_discount: currentProduct.has_discount || false, // Maintain discount status
      dummy_price: currentProduct.dummy_price || null // Maintain original price
    });
  }
};

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
  if (!currentProduct) return;
  
  // Check if inventory item is selected
  if (!currentProduct.inventory_id) {
    setSnackbar({
      open: true,
      message: 'Please select an inventory item',
      severity: 'error'
    });
    return;
  }

  try {
    const formData = new FormData();
    formData.append('description', currentProduct.description || '');
    formData.append('inventory_id', String(currentProduct.inventory_id));
    formData.append('has_discount', String(currentProduct.has_discount));
    if (currentProduct.has_discount && currentProduct.dummy_price) {
      formData.append('dummy_price', String(currentProduct.dummy_price));
    }
  
    if (imageFile) {
      formData.append('image', imageFile);
    }
  
    if (currentProduct.id) {
      await updateProduct(currentProduct.id, formData);
      setSnackbar({
        open: true,
        message: 'Product updated successfully',
        severity: 'success'
      });
    } else {
      await addProduct(formData);
      setSnackbar({
        open: true,
        message: 'Product added successfully',
        severity: 'success'
      });
    }
    
    // Refresh data
    const productsData = await getAllProducts({ page, limit, search: searchTerm, category: categoryFilter });
    setProducts(productsData);
    setFilteredProducts(productsData);
    
    handleCloseDialog();
  } catch (error) {
    console.error('Error saving product:', error);
    setSnackbar({
      open: true,
      message: error instanceof Error ? error.message : 'Failed to save product',
      severity: 'error'
    });
  }
};

  const handleDelete = async () => {
    if (!currentProduct?.id) return;

    try {
      await deleteProduct(currentProduct.id);
      setSnackbar({
        open: true,
        message: 'Product soft-deleted successfully',
        severity: 'success'
      });
      
      // Refresh data
      const productsData = await getAllProducts({ page, limit, search: searchTerm, category: categoryFilter });
      setProducts(productsData);
      setFilteredProducts(productsData);
      
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting product:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to delete product',
        severity: 'error'
      });
    }
  };

  const getAvailableInventoryOptions = () => {
  const usedInventoryIds = products.map(p => p.inventory_id);
  return inventoryOptions.filter(
    option => !usedInventoryIds.includes(option.inventory_id) || 
             (currentProduct?.inventory_id === option.inventory_id)
  );
};

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      bgcolor: '#efdecd'
    }}>
      {/* Navbar - Fixed width */}
      <Box sx={{ 
        width: 240, 
        flexShrink: 0,
        position: 'fixed',
        height: '100vh'
      }}>
        <Navbar />
      </Box>
  
      {/* Main Content */}
      
<Box sx={{ 
  flexGrow: 1,
  p: 3,
  ml: 30,
  width: `calc(100% - 240px)`
}}>

<Box sx={{ 
  display: 'flex', 
  justifyContent: 'space-between', // Aligns the items to the left and space between
  alignItems: 'center', // Vertically aligns the items
  mb: 3, // Adds space below
  width: '100%' // Ensures the full width is used
}}>
  <Typography variant="h4">
    Product Management
  </Typography>

  {/* Add Product Button */}
  <Button 
    variant="contained" 
    startIcon={<Add />}
    onClick={handleOpenAddDialog}
    sx={{ marginLeft: 'auto' }} // Ensures the button is pushed to the right side
  >
    Add Product
  </Button>
</Box>


  
  
  {/* Search and Filter Controls */}
  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
  <MenuItem value="">All Categories</MenuItem>
  <MenuItem value="Dining">Dining</MenuItem>
  <MenuItem value="Bedroom">Bedroom</MenuItem>
  <MenuItem value="Living">Living</MenuItem>
  <MenuItem value="Office">Office</MenuItem>
</Select>

    </FormControl>
    
    
  </Box>

  {/* Product Table */}
  {isLoading ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>
  ) : (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    style={{ width: 50, height: 50, objectFit: 'cover' }}
                  />
                ) : (
                  <ImageIcon color="disabled" />
                )}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>
  Rs.{typeof product.price === 'number' 
    ? product.price.toFixed(2)
    : Number(product.price || 0).toFixed(2)}
</TableCell>
              <TableCell>
  {product.has_discount ? (
    <Chip label="Active" color="success" size="small" />
  ) : (
    <Chip label="None" size="small" />
  )}
</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpenEditDialog(product)}>
                  <Edit color="primary" />
                </IconButton>
                <IconButton onClick={() => handleOpenDeleteDialog(product)}>
                  <Delete color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )}

  {/* Add/Edit Dialog */}
  <Dialog open={openDialog} onClose={handleCloseDialog}>
    <DialogTitle>
      {currentProduct?.id ? 'Edit Product' : 'Add New Product'}
    </DialogTitle>
    <DialogContent>
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
    <FormControl fullWidth>
      <InputLabel>Inventory Item</InputLabel>
      <Select
        value={currentProduct?.inventory_id || ''}
        onChange={handleSelectChange}
        label="Inventory Item"
        disabled={!!currentProduct?.id}
      >
        {getAvailableInventoryOptions().map((option) => (
          <MenuItem key={option.inventory_id} value={option.inventory_id}>
            {option.name} (Rs.{option.price})
          </MenuItem>
        ))}
        {getAvailableInventoryOptions().length === 0 && (
          <MenuItem disabled>No available inventory items</MenuItem>
        )}
      </Select>
    </FormControl>
    
    <TextField
      name="description"
      label="Description"
      value={currentProduct?.description || ''}
      onChange={handleInputChange}
      multiline
      rows={3}
    />
    
    <TextField
      name="price"
      label="Final Price"
      value={currentProduct?.price || ''}
      disabled
    />

    <FormControlLabel
  control={
    <Checkbox
      checked={currentProduct?.has_discount || false}
      onChange={(e) => {
        if (!currentProduct) return;
        setCurrentProduct({
          ...currentProduct,
          has_discount: e.target.checked,
         dummy_price: e.target.checked 
            ? (currentProduct.dummy_price || (currentProduct.price || 0) * 1.2) // Safely handle price
            : null
        });
      }}
    />
  }
  label="Has Discount"
/>
{currentProduct?.has_discount && (
  <TextField
    name="dummy_price"
    label="Original Price (Strikethrough)"
    type="number"
    value={currentProduct?.dummy_price || ''}
    onChange={(e) => {
      if (!currentProduct) return;
      const newDummyPrice = parseFloat(e.target.value);
      setCurrentProduct({
        ...currentProduct,
        dummy_price: newDummyPrice
      });
    }}
    error={currentProduct.has_discount && 
           (currentProduct.dummy_price || 0) <= currentProduct.price}
    helperText={
      currentProduct.has_discount && 
      (currentProduct.dummy_price || 0) <= currentProduct.price
        ? 'Original price must be higher than actual price'
        : ''
    }
    InputProps={{
      startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
    }}
  />
)}
    
    <Button
      variant="outlined"
      component="label"
      startIcon={<ImageIcon />}
    >
      Upload Image
      <input
        type="file"
        hidden
        accept="image/*"
        onChange={handleImageChange}
      />
    </Button>
    {imageFile && (
      <Typography variant="caption">
        {imageFile.name}
      </Typography>
    )}
  </Box>
</DialogContent>
    <DialogActions>
      <Button onClick={handleCloseDialog}>Cancel</Button>
      <Button onClick={handleSubmit} variant="contained">
        Save
      </Button>
    </DialogActions>
  </Dialog>

  {/* Delete Confirmation Dialog */}
  <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      Are you sure you want to delete {currentProduct?.name}?
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
      <Button onClick={handleDelete} color="error" variant="contained">
        Delete
      </Button>
    </DialogActions>
  </Dialog>

  {/* Snackbar for notifications */}
  <Snackbar
    open={snackbar.open}
    autoHideDuration={6000}
    onClose={handleCloseSnackbar}
  >
    <Alert 
      onClose={handleCloseSnackbar} 
      severity={snackbar.severity}
    >
      {snackbar.message}
    </Alert>
  </Snackbar>

      </Box>
    </Box>
  );
};

export default ProductList;