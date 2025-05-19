import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  TextField, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import Navbar from '../components/Adminnavbar';
import SalesChart  from '../components/SalesChart';
import axiosInstance from '../api/axiosInstance';
import { AxiosError } from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}



const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Box display="flex" alignItems="center">
        <Typography variant="h4" component="div">
          {value}
        </Typography>
        {icon && (
          <Box ml={2}>
            {icon}
          </Box>
        )}
      </Box>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const [salesTrend, setSalesTrend] = useState<any[]>([]); //new
  const [customSalesTrend, setcustomSalesTrend] = useState<any[]>([]); //new
  const [timeRange, setTimeRange] = useState<string>('day');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    salesRevenue: 0,
    lowInventory: [],
    recentOrders: [],
    recentCustomOrders: [],
  });
  const [error, setError] = useState('');
   const [success, setSuccess] = useState('');
   const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
   const [passwordData, setPasswordData] = useState<PasswordData>({
     currentPassword: '',
     newPassword: '',
     confirmPassword: ''
   });

   const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          ordersRes, 
          productsRes, 
          customersRes, 
          salesRes, 
          inventoryRes,
          recentOrdersRes,
          recentCustomOrdersRes,
          trendRes,
          customtrendRes
        ] = await Promise.all([
          axios.get(`/api/dashboard/total-orders?range=${timeRange}`),
          axios.get('/api/dashboard/total-products'),
          axios.get(`/api/dashboard/total-customers?range=${timeRange}`),
          axios.get(`/api/dashboard/sales-revenue?range=${timeRange}`),
          axios.get('/api/dashboard/low-inventory'),
          axios.get('/api/dashboard/recent-orders'),
          axios.get('/api/dashboard/recent-customorders'),
          axios.get(`/api/dashboard/sales-trend?range=${timeRange}`),
          axios.get(`/api/dashboard/custom-sales-trend?range=${timeRange}`)
        ]);

        

        setStats({
          totalOrders: ordersRes.data.total,
          totalProducts: productsRes.data.total,
          totalCustomers: customersRes.data.total,
          salesRevenue: salesRes.data.total,
          lowInventory: inventoryRes.data.items,
          recentOrders: recentOrdersRes.data.orders,
          recentCustomOrders: recentCustomOrdersRes.data.customOrders || []
        });
        setSalesTrend(trendRes.data.trendData || []);
        setcustomSalesTrend(customtrendRes.data.trendData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(value);
  };

const validatePassword = (password: string): string | null => {
    if (password.length < 8) return 'Must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Must contain uppercase letter';
    if (!/[a-z]/.test(password)) return 'Must contain lowercase letter';
    if (!/[0-9]/.test(password)) return 'Must contain number';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Must contain special character';
    return null;
  };

   const handleOpenPasswordDialog = () => {
    setError('');
    setSuccess('');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setOpenPasswordDialog(true);
  };

const handlePasswordChange = async () => {
    // Validate password match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(passwordData.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await axiosInstance.put('/auth/change-password', {
        userId: user.id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Password changed successfully');
      setOpenPasswordDialog(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Failed to change password');
      } else {
        setError('An unknown error occurred');
      }
    }
  };



  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        bgcolor: '#efdecd'
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          flexShrink: 0,
          position: 'fixed',
          height: '100vh'
        }}
      >
        <Navbar />
      </Box>

      {/* Main Dashboard Content */}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          ml: '240px',
          width: `calc(100% - 240px)`
        }}
      >
        <Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3
  }}
>
  <Typography variant="h4">Dashboard Overview</Typography>

  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <FormControl sx={{ minWidth: 120 }} size="small">
      <InputLabel>Time Range</InputLabel>
      <Select
        value={timeRange}
        label="Time Range"
        onChange={(e) => setTimeRange(e.target.value)}
      >
        <MenuItem value="day">Today</MenuItem>
        <MenuItem value="month">This Month</MenuItem>
        <MenuItem value="year">This Year</MenuItem>
        <MenuItem value="all">All Time</MenuItem>
      </Select>
    </FormControl>

    <Button 
      variant="outlined" 
      onClick={handleOpenPasswordDialog}
    >
      Change Password
    </Button>
    <Button 
      variant="outlined" 
       onClick={() => navigate('/forgot-password')}
    >
     Forget Password
    </Button>
  </Box>
</Box>


        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Orders" value={stats.totalOrders} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Active Products" value={stats.totalProducts} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total New Customers" value={stats.totalCustomers} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Sales Revenue" value={formatCurrency(stats.salesRevenue)} />
              </Grid>
            </Grid>

            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Low Inventory Items ({stats.lowInventory.length})
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Current Stock</TableCell>
                      <TableCell align="right">Reorder Level</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.lowInventory.length > 0 ? (
                      stats.lowInventory.map((item: any) => (
                        <TableRow key={item.inventory_id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">{item.reorder_level}</TableCell>
                          <TableCell>
                            <Typography color={item.quantity <= 0 ? 'error' : 'warning.main'}>
                              {item.quantity <= 0 ? 'Out of Stock' : 'Low Stock'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No low inventory items
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
  <Typography variant="h6" gutterBottom>
    Recent Normal Orders
  </Typography>
  <TableContainer>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Order ID</TableCell>
          <TableCell>Customer</TableCell>
          <TableCell align="right">Amount</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {stats.recentOrders.length > 0 ? (
          stats.recentOrders.map((order: any) => (
            <TableRow key={order.id}>
              <TableCell>#{order.id}</TableCell>
              <TableCell>{order.customer_name}</TableCell>
              <TableCell align="right">{formatCurrency(order.total_price)}</TableCell>
              <TableCell>
                <Typography 
                  color={
                    order.status === 'completed' ? 'success.main' :
                    order.status === 'cancelled' ? 'error' : 'inherit'
                  }
                >
                  {order.status}
                </Typography>
              </TableCell>
              <TableCell>
                {new Date(order.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} align="center">
              No recent orders
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
</Paper>
              </Grid>
<Grid item xs={12} md={6}>
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>
      Recent Custom Orders
    </Typography>
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.recentCustomOrders?.length > 0 ? (
            stats.recentCustomOrders.map((order: any) => (
              <TableRow key={order.custom_order_id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell align="right">{formatCurrency(order.total_price)}</TableCell>
                <TableCell>
                  <Typography 
                    color={
                      order.production_status === 'delivered' ? 'success.main' :
                      order.production_status === 'not_started' ? 'text.secondary' :
                      'warning.main'
                    }
                  >
                    {order.status.replace('_', ' ')}
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No recent custom orders
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
</Grid>








              <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '400px' }}>
  <Typography variant="h6" gutterBottom>
    Sales Trend for Normal Orders
  </Typography>
  {salesTrend.length > 0 ? (
    <SalesChart 
      data={salesTrend} 
      currency="LKR" 
    />
  ) : (
    <Typography color="text.secondary">No sales data available</Typography>
  )}
</Paper>
              </Grid>


<Grid item xs={12} md={6}>
  <Paper sx={{ p: 2, height: '400px' }}>
    <Typography variant="h6" gutterBottom>
      Sales Trend for Custom Orders
    </Typography>
    {customSalesTrend.length > 0 ? (
      <SalesChart 
        data={customSalesTrend} 
        currency="LKR" 
      />
    ) : (
      <Typography color="text.secondary">No custom order sales data available</Typography>
    )}
  </Paper>
</Grid>



            </Grid>
          </>
        )}
      </Box>

 <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              margin="normal"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
            />
            
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              error={!!validatePassword(passwordData.newPassword) && passwordData.newPassword.length > 0}
              helperText={
                passwordData.newPassword.length > 0 
                  ? validatePassword(passwordData.newPassword) || 'Password meets requirements' 
                  : 'At least 8 characters with uppercase, lowercase, number, and special character'
              }
            />
            
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              margin="normal"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              error={passwordData.confirmPassword.length > 0 && 
                    passwordData.newPassword !== passwordData.confirmPassword}
              helperText={
                passwordData.confirmPassword.length > 0 && 
                passwordData.newPassword !== passwordData.confirmPassword 
                  ? 'Passwords do not match' 
                  : ''
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
            <Button 
              onClick={handlePasswordChange} 
              variant="contained"
              disabled={
                !passwordData.currentPassword || 
                !passwordData.newPassword || 
                !passwordData.confirmPassword ||
                !!validatePassword(passwordData.newPassword) ||
                passwordData.newPassword !== passwordData.confirmPassword
              }
            >
              Change Password
            </Button>
          </DialogActions>
        </Dialog>

    </Box>
  );
};

export default DashboardPage;