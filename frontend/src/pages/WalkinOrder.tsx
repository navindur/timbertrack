import React, { useState, useEffect } from 'react';
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
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add, Remove, Print, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createWalkinOrder } from '../services/walkinOrderService';
import { getAvailableProducts } from '../services/productService';
import { Product as BaseProduct } from '../types/product';
import { WalkinProduct } from '../services/productService';
import Navbar from '../components/Adminnavbar';

interface Product {
  id: number;
  name: string;
  price: number;
  inventory_quantity: number;
  image_url?: string;
}
interface Product extends BaseProduct {
    inventory_quantity: number;  
    price: number;             
  }

interface CartItem extends Product {
  cartQuantity: number;
}

const WalkinOrder: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [customer, setCustomer] = useState({
    first_name: '',
    last_name: '',
    phone_num: '',
    address_line1: '',
    city: '',
    postal_code: ''
  });
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});


  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const products = await getAvailableProducts();
        setProducts(products);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === product.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === product.id
            ? { ...cartItem, cartQuantity: cartItem.cartQuantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...product, cartQuantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, cartQuantity: newQuantity }
          : item
      )
    );
  };

const validateCustomer = () => {
  const newErrors: Record<string, string> = {};

  const { first_name, last_name, phone_num, address_line1, city, postal_code } = customer;

  if (!first_name.trim()) {
    newErrors.first_name = 'First name is required';
  } else if (!/^[A-Za-z]{2,30}$/.test(first_name)) {
    newErrors.first_name = 'Must be 2–30 letters only';
  }

  if (!last_name.trim()) {
    newErrors.last_name = 'Last name is required';
  } else if (!/^[A-Za-z]{2,30}$/.test(last_name)) {
    newErrors.last_name = 'Must be 2–30 letters only';
  }

  if (
    first_name.trim().toLowerCase() === last_name.trim().toLowerCase() &&
    first_name.trim() !== '' &&
    last_name.trim() !== ''
  ) {
    newErrors.last_name = 'Last name cannot be the same as first name';
  }

  if (!phone_num.trim()) {
    newErrors.phone_num = 'Phone number is required';
  } else if (!/^0\d{9}$/.test(phone_num)) {
    newErrors.phone_num = 'Must start with 0 and be 10 digits';
  }

  if (!address_line1.trim()) {
    newErrors.address_line1 = 'Address is required';
  } else if (!/^[A-Za-z0-9\s,.'-]{5,100}$/.test(address_line1)) {
    newErrors.address_line1 = 'Must be 5–100 valid characters';
  }

  if (!city.trim()) {
    newErrors.city = 'City is required';
  } else if (!/^[A-Za-z\s]{2,50}$/.test(city)) {
    newErrors.city = 'Must be 2–50 letters and spaces';
  }

  if (!postal_code.trim()) {
    newErrors.postal_code = 'Postal code is required';
  } else if (!/^\d{5}$/.test(postal_code)) {
    newErrors.postal_code = 'Must be exactly 5 digits';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async () => {
  if (!validateCustomer()) {
    return;
  }

  if (cart.length === 0) {
    alert('Please add items to the cart');
    return;
  }

  try {
    const orderItems = cart.map(item => ({
      product_id: item.id,
      quantity: item.cartQuantity,
      price: item.price
    }));

    const totalAmount = calculateTotal();
    const result = await createWalkinOrder({
      customer,
      items: orderItems,
      paymentMethod,
      totalAmount
    });

    setCreatedOrderId(result.orderId);
    setOpenSuccessDialog(true);
  } catch (error) {
    console.error('Error creating order:', error);
    alert('Failed to create order');
  }
};


  const handlePrintReceipt = () => {
    if (createdOrderId) {
      navigate(`/walkin-orders/${createdOrderId}/receipt`);
    }
  };

  return (
    
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      bgcolor: '#efdecd'
    }}>
      
      <Box sx={{ 
        width: 240, 
        flexShrink: 0,
        position: 'fixed',
        height: '100vh'
      }}>
        <Navbar />
      </Box>
    
      <Box sx={{ 
        flexGrow: 1, 
        p: 3, 
        ml: 30,
        width: `calc(100% - 240px)`
      }}>
      <Typography variant="h4" gutterBottom>
        Walk-in Customer Order
      </Typography>

      <Grid container spacing={3}>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Available Products
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>Rs. {Number(product.price).toFixed(2)}</TableCell>
                      <TableCell>{product.inventory_quantity}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => addToCart(product)}
                          disabled={
                              product.inventory_quantity === 0 ||
                              cart.find(item => item.id === product.id)?.cartQuantity === product.inventory_quantity
                                }
                        >
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            {cart.length === 0 ? (
              <Typography>No items in cart</Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>Rs. {Number(item.price).toFixed(2)}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                            {item.cartQuantity}
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                              disabled={item.cartQuantity >= item.inventory_quantity}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell>Rs.{(item.price * item.cartQuantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Typography variant="h6">
                Total: Rs.{calculateTotal().toFixed(2)}
              </Typography>
            </Box>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card')}
                label="Payment Method"
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="card">Card</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

       
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={customer.first_name}
                  onChange={handleCustomerChange}
                  error={!!errors.first_name}
                  helperText={errors.first_name}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={customer.last_name}
                  onChange={handleCustomerChange}
                  error={!!errors.last_name}
                  helperText={errors.last_name}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone_num"
                  value={customer.phone_num}
                  onChange={handleCustomerChange}
                  error={!!errors.phone_num}
                  helperText={errors.phone_num}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address 1"
                  name="address_line1"
                  value={customer.address_line1}
                  onChange={handleCustomerChange}
                  error={!!errors.address_line1}
                  helperText={errors.address_line1}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={customer.city}
                  onChange={handleCustomerChange}
                  error={!!errors.city}
                  helperText={errors.city}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  name="postal_code"
                  value={customer.postal_code}
                  onChange={handleCustomerChange}
                  error={!!errors.postal_code}
                  helperText={errors.postal_code}
                  required
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Save />}
          onClick={handleSubmitOrder}
          disabled={cart.length === 0}
        >
          Place Order
        </Button>
      </Box>

      <Dialog open={openSuccessDialog} onClose={() => setOpenSuccessDialog(false)}>
        <DialogTitle>Order Created Successfully</DialogTitle>
        <DialogContent>
          <Typography>Order ID: {createdOrderId}</Typography>
          <Typography sx={{ mt: 2 }}>Total: Rs.{calculateTotal().toFixed(2)}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSuccessDialog(false)}>Close</Button>
          <Button 
            variant="contained"
            startIcon={<Print />}
            onClick={handlePrintReceipt}
          >
            Print Receipt
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </Box> 
   
  );
};

export default WalkinOrder;