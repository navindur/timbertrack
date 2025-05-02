import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import Navbar from '../components/Adminnavbar';
import SalesChart  from '../components/SalesChart';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
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
  const [timeRange, setTimeRange] = useState<string>('day');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    salesRevenue: 0,
    lowInventory: [],
    recentOrders: []
  });

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
          trendRes
        ] = await Promise.all([
          axios.get(`/api/dashboard/total-orders?range=${timeRange}`),
          axios.get('/api/dashboard/total-products'),
          axios.get(`/api/dashboard/total-customers?range=${timeRange}`),
          axios.get(`/api/dashboard/sales-revenue?range=${timeRange}`),
          axios.get('/api/dashboard/low-inventory'),
          axios.get('/api/dashboard/recent-orders'),
          axios.get(`/api/dashboard/sales-trend?range=${timeRange}`)
        ]);

        setStats({
          totalOrders: ordersRes.data.total,
          totalProducts: productsRes.data.total,
          totalCustomers: customersRes.data.total,
          salesRevenue: salesRes.data.total,
          lowInventory: inventoryRes.data.items,
          recentOrders: recentOrdersRes.data.orders
        });
        setSalesTrend(trendRes.data.trendData || []);
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
                <StatCard title="Total Customers" value={stats.totalCustomers} />
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
    Recent Orders
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
              <Paper sx={{ p: 2, height: '400px' }}>
  <Typography variant="h6" gutterBottom>
    Sales Trends
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
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default DashboardPage;