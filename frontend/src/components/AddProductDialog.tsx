import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack
} from '@mui/material';

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
  onAddProduct: (product: any) => void;
}

const AddProductDialog: React.FC<AddProductDialogProps> = ({ 
  open, 
  onClose, 
  onAddProduct 
}) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock_quantity: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onAddProduct({
      ...productData,
      price: parseFloat(productData.price),
      stock_quantity: parseInt(productData.stock_quantity),
      is_active: true
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            name="name"
            label="Product Name"
            fullWidth
            value={productData.name}
            onChange={handleChange}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={productData.description}
            onChange={handleChange}
          />
          <TextField
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={productData.price}
            onChange={handleChange}
            InputProps={{ startAdornment: '$' }}
          />
          <TextField
            name="category"
            label="Category"
            fullWidth
            value={productData.category}
            onChange={handleChange}
          />
          <TextField
            name="stock_quantity"
            label="Stock Quantity"
            type="number"
            fullWidth
            value={productData.stock_quantity}
            onChange={handleChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;