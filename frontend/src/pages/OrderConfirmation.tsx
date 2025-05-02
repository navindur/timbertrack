import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  name: string;
  image_url: string;
}

interface Order {
  id: number;
  status: string;
  total_price: number | string;
  payment_method: string;
  created_at: string;
  first_name: string;
  last_name: string;
  phone_num: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  postal_code: string;
  items: OrderItem[];
}

const OrderConfirmation = () => {
  const { order_id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/${order_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data.success || !res.data.order) {
          throw new Error('Invalid response format');
        }

        const orderData = res.data.order;

        if (!orderData.id || !orderData.items || !Array.isArray(orderData.items)) {
          throw new Error('Order data is incomplete');
        }

        setOrder(orderData);
      } catch (error) {
        console.error('Error:', error);
        setError(
          axios.isAxiosError(error)
            ? error.response?.data?.message ||
              error.response?.data?.error ||
              error.message ||
              'Failed to load order details'
            : error instanceof Error
            ? error.message
            : 'Failed to load order details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [order_id, navigate]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        nav, footer, .no-print {
          display: none !important;
        }
        .print-container {
          padding: 20px;
          margin: 0;
        }
        .MuiPaper-root {
          box-shadow: none !important;
        }
        button {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">{error}</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">Order not found</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </Box>
    );
  }

  const formatPaymentMethod = (method: string) => {
    if (!method) return 'Unknown';
    return method.replace(/_/g, ' ');
  };

  return (
    <>
      <div className="no-print">
        <Navbar />
      </div>

      <Box className="print-container" sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography
          variant="h5"
          sx={{ display: 'none', '@media print': { display: 'block', textAlign: 'center', mb: 3 } }}
        >
          Jayarani Furnitures – Order Receipt
        </Typography>
        <Typography variant="h4" gutterBottom>
          Order Confirmation
        </Typography>
        <Typography variant="h6" gutterBottom>
          Thank you for your order!
        </Typography>
        <Typography sx={{ mb: 3 }}>
          Your order number is #{order.id}. We will update the order status here.
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Order Date:</Typography>
            <Typography>
              {new Date(order.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Status:</Typography>
            <Typography sx={{ textTransform: 'capitalize' }}>
              {order.status || 'Processing'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>Payment Method:</Typography>
            <Typography sx={{ textTransform: 'capitalize' }}>
              {formatPaymentMethod(order.payment_method)}
            </Typography>
          </Box>
        </Paper>

        <Typography variant="h6" gutterBottom>
          Shipping Address
        </Typography>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography>{order.first_name} {order.last_name}</Typography>
          <Typography>{order.address_line1}</Typography>
          {order.address_line2 && <Typography>{order.address_line2}</Typography>}
          <Typography>{order.city}, {order.postal_code}</Typography>
          <Typography>Phone: {order.phone_num}</Typography>
        </Paper>

        <Typography variant="h6" gutterBottom>
          Order Items
        </Typography>
        <List>
          {order.items.map((item) => (
            <ListItem key={item.id} divider>
              <ListItemAvatar>
                <Avatar src={item.image_url} alt={item.name} />
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={`Quantity: ${item.quantity}`}
              />
              <Typography variant="body2">
                Rs.{(item.price * item.quantity).toFixed(2)}
              </Typography>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="h6">
            Total Rs.{(typeof order.total_price === 'number'
              ? order.total_price.toFixed(2)
              : parseFloat(order.total_price || '0').toFixed(2))}
          </Typography>
        </Box>

        <Box className="no-print" sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" onClick={() => navigate('/allorderview')}>
            View All Orders
          </Button>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
          <Button variant="outlined" onClick={() => window.print()}>
            Print / Save as PDF
          </Button>
        </Box>
      </Box>

      <div className="no-print">
        <Footer />
      </div>
    </>
  );
};

export default OrderConfirmation;