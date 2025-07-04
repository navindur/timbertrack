//order details view for shop owner
import React, { useState, useEffect } from 'react';
import {
  Table,
  TextField,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Pagination,
  CircularProgress,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Adminnavbar';
import { fetchOrders } from '../services/ownerorderService';
import { Order } from '../types/ownerorder';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const data = await fetchOrders(page, limit, statusFilter, searchTerm);
        setOrders(data.orders);
        setTotalOrders(data.total);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, [page, limit, statusFilter, searchTerm]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleStatusFilterChange = (e: any) => {
    setStatusFilter(e.target.value);
    setPage(1); 
  };

  const getStatusColor = (status: string) => {//get color for order status chip
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
  <Typography variant="h4">
    Order Management
  </Typography>
  <Button
    variant="contained"
    color="primary"
    onClick={() => navigate('/ownercustom-ordersview')}
  >
    Custom Orders
  </Button>
</Box>


        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
  <TextField
    placeholder="Search by ID, name, or date (YYYY-MM-DD)"
    variant="outlined"
    size="small"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />

        </InputAdornment>
      ),
    }}
    sx={{ flexGrow: 1, maxWidth: 400 }}
  />
  
  <FormControl sx={{ minWidth: 200 }}>
    <InputLabel>Status</InputLabel>
    <Select
      value={statusFilter}
      onChange={handleStatusFilterChange}
      label="Status"
    >
      <MenuItem value="">All Statuses</MenuItem>
      <MenuItem value="pending">Pending</MenuItem>
      <MenuItem value="processing">Processing</MenuItem>
      <MenuItem value="shipped">Shipped</MenuItem>
      <MenuItem value="delivered">Delivered</MenuItem>
      <MenuItem value="cancelled">Cancelled</MenuItem>
    </Select>
  </FormControl>
</Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>Rs.{Number(order.total_price).toFixed(2)}
                      </TableCell>
                      <TableCell>
                       {order.payment_method === 'cash'
                              ? 'Cash (walk-in)'
                              : order.payment_method === 'cash_on_delivery'
                              ? 'Cash on Delivery'
                              : 'Card Payment'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={order.status} 
                          color={getStatusColor(order.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/ownerorders/${order.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

           
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={Math.ceil(totalOrders / limit)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default OrderList;