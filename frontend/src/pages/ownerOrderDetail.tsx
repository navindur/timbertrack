import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Chip,
  Divider,
  Grid,
  Avatar
} from '@mui/material';
import Navbar from '../components/Adminnavbar';
import { fetchOrderDetails, updateOrderStatus } from '../services/ownerorderService';
import { OrderWithDetails } from '../types/ownerorder';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await fetchOrderDetails(parseInt(id));
        setOrder(data);
        setStatus(data.status);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  const handleStatusChange = async () => {
    if (!id || !status) return;
    
    setIsUpdating(true);
    try {
      await updateOrderStatus(parseInt(id), status);
      // Refresh order data
      const updatedOrder = await fetchOrderDetails(parseInt(id));
      setOrder(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'processing':
        return 'primary';
      case 'shipped':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return <Typography>Order not found</Typography>;
  }

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">
            Order #{order.id}
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => navigate(-1)}
          >
            Back to Orders
          </Button>
        </Box>

        {/* Order Summary */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Typography><strong>Name:</strong> {order.customer_name}</Typography>
              <Typography><strong>Email:</strong> {order.customer_email}</Typography>
              <Typography><strong>Phone:</strong> {order.customer_phone}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Order Information
              </Typography>
              <Typography>
                <strong>Date:</strong> {new Date(order.created_at).toLocaleString()}
              </Typography>
              <Typography>
                <strong>Status:</strong> 
                <Chip 
                  label={order.status} 
                  color={getStatusColor(order.status)}
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography>
                <strong>Payment Method:</strong> 
                {order.payment_method === 'cash'
  ? 'Cash (walk-in)'
  : order.payment_method === 'cash_on_delivery'
  ? 'Cash on Delivery'
  : 'Card Payment'}
              </Typography>
              <Typography>
                <strong>Total:</strong> Rs.{Number(order.total_price).toFixed(2)}

              </Typography>
              <Button 
    variant="outlined" 
    size="small" 
    sx={{ mt: 2 }}
    onClick={() => navigate(`/walkin-orders/${order.id}/receipt`)}
  >
    View Receipt
  </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Typography>{order.customer_address}</Typography>
              <Typography>{order.customer_city}, {order.customer_postal_code}</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Order Items */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Items
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={item.product_image} 
                          alt={item.product_name}
                          sx={{ width: 56, height: 56, mr: 2 }}
                        />
                        {item.product_name}
                      </Box>
                    </TableCell>
                    <TableCell>Rs.{Number(item.price).toFixed(2)}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>Rs.{(item.price * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Update Status */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Update Order Status
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleStatusChange}
              disabled={isUpdating || status === order.status}
            >
              {isUpdating ? <CircularProgress size={24} /> : 'Update Status'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default OrderDetail;