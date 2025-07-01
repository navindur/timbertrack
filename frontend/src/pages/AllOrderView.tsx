//shows all orders to customer
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  CircularProgress,
  Button,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

interface Order {
  id: number;
  createdAt: string;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  itemCount: number;
}

export const AllOrderView = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('authToken'); 
        if (!token) {
          navigate('/login'); //hv to login before view
          return;
        }

        const { data } = await axios.get<{ success: boolean; orders?: Order[] }>(
          `${import.meta.env.VITE_API_BASE_URL}/allorderview`, //API endpoint to get all orders
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!data.success || !data.orders) {
          throw new Error('Failed to load orders');
        }

        setOrders(data.orders);
      } catch (err) {
        setError(axios.isAxiosError(err) 
          ? err.response?.data?.message || 'Failed to load orders'
          : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const formatCurrency = (amount: number) => { //function to format currency
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
    }).format(amount);
  };

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Navbar />
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>My Orders</Typography>
      
      {orders.length === 0 ? (
        <Box textAlign="center" mt={4}>
          <Typography>No orders found</Typography>
          <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
            Start Shopping
          </Button>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Date</TableCell>
                
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
  {order.createdAt && !isNaN(new Date(order.createdAt).getTime())
    ? format(new Date(order.createdAt), 'MMM d, yyyy')
    : 'Invalid date'}
</TableCell>

                  
                  <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>
                    {order.status}
                  </TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>
                    {order.paymentMethod.replace('_', ' ')} 
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/order-confirmation/${order.id}`)} //navigate to order confirmation page
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
    <Footer />
    </>
  );
};

export default AllOrderView;