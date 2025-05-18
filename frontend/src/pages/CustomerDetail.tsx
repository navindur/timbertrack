import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Grid,
  TableHead,
  TableRow,
  Button,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Adminnavbar';
import { getCustomer } from '../services/customerinfoService';

interface CustomerDetail {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_num: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  created_at: string;
  order_count: number;
  orders: Array<{
    id: number;
    created_at: string;
    status: string;
    total_price: number;
    payment_method: string;
  }>;
  custom_orders: Array<{
    custom_order_id: number;
    request_date: string;
    status: string;
    estimated_price: number;
    payment_status: string;
    production_status: string;
  }>;
}

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const data = await getCustomer(Number(id));
        setCustomer(data);
      } catch (error) {
        console.error('Error fetching customer:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCustomer();
  }, [id]);

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'warning';
    case 'processing': 
    case 'in_progress': return 'primary';
    case 'shipped': return 'info';
    case 'delivered': 
    case 'accepted': return 'success';
    case 'cancelled': 
    case 'rejected': return 'error';
    case 'finished': return 'secondary';
    default: return 'default';
  }
};

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!customer) {
    return <Typography>Customer not found</Typography>;
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
        ml: '240px',
        width: `calc(100% - 240px)`
      }}>
        <Button 
          variant="outlined" 
          sx={{ mb: 2 }}
          onClick={() => navigate(-1)}
        >
          Back to Customers
        </Button>

        <Typography variant="h4" gutterBottom>
          {customer.first_name} {customer.last_name}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Email</Typography>
                <Typography>{customer.email}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Phone</Typography>
                <Typography>{customer.phone_num}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Address</Typography>
                <Typography>
                  {customer.address_line1}<br />
                  {customer.address_line2 && <>{customer.address_line2}<br /></>}
                  {customer.city}, {customer.postal_code}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2">Member Since</Typography>
                <Typography>
                  {new Date(customer.created_at).toLocaleDateString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Normal Orders ({customer.order_count})
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {customer.orders.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Payment</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customer.orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>Rs.{Number(order.total_price).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {
  order.payment_method === 'cash'
    ? 'Cash'
    : order.payment_method === 'cash_on_delivery'
    ? 'Cash on Delivery'
    : 'Card Payment'
}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={order.status} 
                              color={getStatusColor(order.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No recent orders</Typography>
              )}
            </Paper>
          </Grid>
   <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Recent Custom Orders ({customer.custom_orders.length})
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      {customer.custom_orders.length > 0 ? (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Request Date</TableCell>
                <TableCell>Est. Price</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customer.custom_orders.map((order) => (
                <TableRow key={order.custom_order_id}>
                  <TableCell>#{order.custom_order_id}</TableCell>
                  <TableCell>
                    {new Date(order.request_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    Rs.{order.estimated_price ? Number(order.estimated_price).toFixed(2) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      color={
                        order.status === 'Accepted' ? 'success' : 
                        order.status === 'Rejected' ? 'error' : 'warning'
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No custom orders</Typography>
      )}
    </Paper>
  </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CustomerDetail;