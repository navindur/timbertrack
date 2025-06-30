import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Search, PictureAsPdf } from '@mui/icons-material';
import Navbar from '../components/Adminnavbar';
import { 
  fetchSalesSummary,
  fetchSalesByProduct,
  fetchSalesByCategory,
  fetchLowStock,
  fetchInventoryValuation,
  fetchTopCustomers,
  fetchSalesByPaymentMethod,
  fetchOrdersByStatus,
  fetchCustomOrdersByStatus
} from '../services/reportServices';

interface ReportData {
  [key: string]: any;
}

const ReportsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sales-summary');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<ReportData | ReportData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    if (activeTab !== 'low-stock' && activeTab !== 'inventory-valuation' && (!startDate || !endDate)) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let data;
        switch (activeTab) {
          case 'sales-summary':
            data = await fetchSalesSummary(startDate, endDate);
            break;
          case 'sales-product':
            data = await fetchSalesByProduct(startDate, endDate);
            break;
          case 'sales-category':
            data = await fetchSalesByCategory(startDate, endDate);
            break;
          case 'low-stock':
            data = await fetchLowStock();
            break;
          case 'inventory-valuation':
            data = await fetchInventoryValuation();
            break;
          case 'top-customers':
            data = await fetchTopCustomers(startDate, endDate);
            break;
            case 'sales-payment':
      data = await fetchSalesByPaymentMethod(startDate, endDate);
      break;
    case 'orders-status':
      data = await fetchOrdersByStatus(startDate, endDate);
      break;
  case 'customorders-status':
    data = await fetchCustomOrdersByStatus(startDate, endDate);
    break;
          default:
            data = null;
        }
        setReportData(data);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch report data',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, startDate, endDate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    setReportData(null);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    const value = e.target.value;
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const handleCategoryChange = (e: any) => {
    setCategoryFilter(e.target.value);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const downloadPdf = () => {
    let url = '';
    const params = new URLSearchParams();
    
    if (startDate && endDate) {
      params.append('start', startDate);
      params.append('end', endDate);
    }

    switch (activeTab) {
      case 'sales-summary':
        url = `/api/reports/sales-summary/pdf?${params.toString()}`;
        break;
      case 'sales-product':
        url = `/api/reports/sales-by-product/pdf?${params.toString()}`;
        break;
      case 'sales-category':
        url = `/api/reports/sales-by-category/pdf?${params.toString()}`;
        break;
      case 'low-stock':
        url = `/api/reports/inventory/low-stock/pdf`;
        break;
      case 'inventory-valuation':
        url = `/api/reports/inventory/valuation/pdf`;
        break;
      case 'top-customers':
        url = `/api/reports/customers/top/pdf?${params.toString()}`;
        break;
        case 'sales-payment':
      url = `/api/reports/sales-by-payment/pdf?${params.toString()}`;
      break;
    case 'orders-status':
      url = `/api/reports/orders/status/pdf?${params.toString()}`;
      break;
      case 'customorders-status':
      url = `/api/reports/customorders/status/pdf?${params.toString()}`;
      break;
      default:
        return;
    }

    window.open(url, '_blank');
  };

  const renderReportContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!reportData) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>Select date range and apply to view report</Typography>
        </Box>
      );
    }

    switch (activeTab) {
      case 'sales-summary':
        return renderSalesSummary();
      case 'sales-product':
        return renderSalesByProduct();
      case 'sales-category':
        return renderSalesByCategory();
      case 'low-stock':
        return renderLowStock();
      case 'inventory-valuation':
        return renderInventoryValuation();
      case 'top-customers':
        return renderTopCustomers();
        case 'sales-payment':
      return renderSalesByPayment();
    case 'orders-status':
      return renderOrdersByStatus();
      case 'customorders-status':
      return rendercustomOrdersByStatus();
      default:
        return null;
    }
  };

  const renderSalesSummary = () => {
  const data = reportData as any;
  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6">Total Orders</Typography>
          <Typography variant="h4">{data.total_orders}</Typography>
        </Paper>
        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6">Total Revenue</Typography>
          <Typography variant="h4">Rs.{Number(data.total_revenue).toFixed(2)}</Typography>
        </Paper>
        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6">Total Items from Inventory Sold</Typography>
          <Typography variant="h4">{data.total_items_sold}</Typography>
        </Paper>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>Sales Breakdown</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell align="right">Orders</TableCell>
              <TableCell align="right">Revenue</TableCell>
              <TableCell align="right">Percentage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Regular Orders</TableCell>
              <TableCell align="right">{data.regular_orders}</TableCell>
              <TableCell align="right">Rs.{Number(data.regular_revenue).toFixed(2)}</TableCell>
              <TableCell align="right">{data.regular_percentage}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Custom Orders</TableCell>
              <TableCell align="right">{data.custom_orders}</TableCell>
              <TableCell align="right">Rs.{Number(data.custom_revenue).toFixed(2)}</TableCell>
              <TableCell align="right">{data.custom_percentage}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

  const renderSalesByProduct = () => {
    const data = reportData as any[];
    return (
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell align="right">Quantity Sold</TableCell>
              <TableCell align="right">Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell align="right">{row.total_quantity}</TableCell>
                <TableCell align="right">Rs.{Number(row.total_revenue).toFixed(2)
                }</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderSalesByCategory = () => {
    const data = reportData as any[];
    return (
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell align="right">Quantity Sold</TableCell>
              <TableCell align="right">Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.category}>
                <TableCell>{row.category}</TableCell>
                <TableCell align="right">{row.total_quantity}</TableCell>
                <TableCell align="right">Rs.{Number(row.total_revenue).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderLowStock = () => {
    const data = reportData as any[];
    return (
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Inventory ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell align="right">Current Quantity</TableCell>
              <TableCell align="right">Reorder Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.inventory_id}>
                <TableCell>{row.inventory_id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{row.reorder_level}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderInventoryValuation = () => {
    const data = reportData as any[];
    return (
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Inventory ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell align="right">Total Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.inventory_id}>
                <TableCell>{row.inventory_id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">
  Rs.{Number(row.price).toFixed(2)}
</TableCell>
<TableCell align="right">
  Rs.{Number(row.total_value).toFixed(2)}
</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderTopCustomers = () => {
    const data = reportData as any[];
    return (
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Total Spent</TableCell>
              <TableCell align="right">Total Orders</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.customer_id}>
                <TableCell>{row.customer_id}</TableCell>
                <TableCell>{row.first_name} {row.last_name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell align="right">
  Rs.{Number(row.total_spent).toFixed(2)}
</TableCell>

                <TableCell align="right">{row.total_orders}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderSalesByPayment = () => {
    const data = reportData as any[];
    return (
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment Method</TableCell>
              <TableCell align="right">Order Count</TableCell>
              <TableCell align="right">Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.payment_method}>
                <TableCell>
                  
                                {row.payment_method === 'cash'
                    ? 'Cash (walk-in)'
                    : row.payment_method === 'cash_on_delivery'
                    ? 'Cash on Delivery'
                    : 'Card Payment'}
                </TableCell>
                <TableCell align="right">{row.order_count}</TableCell>
                <TableCell align="right">Rs.{Number(row.revenue).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderOrdersByStatus = () => {
    const data = reportData as any[];
    return (
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell align="right">Order Count</TableCell>
              <TableCell align="right">Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.status}>
                <TableCell>
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </TableCell>
                <TableCell align="right">{row.count}</TableCell>
                <TableCell align="right">Rs.{Number(row.revenue).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const rendercustomOrdersByStatus = () => {
    const data = reportData as any[];
    return (
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell align="right">Order Count</TableCell>
              <TableCell align="right">Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.status}>
                <TableCell>
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </TableCell>
                <TableCell align="right">{row.count}</TableCell>
                <TableCell align="right">Rs.{Number(row.total_estimated_price).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
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
          <Typography variant="h4">Reports</Typography>
          <Button 
            variant="contained" 
            startIcon={<PictureAsPdf />}
            onClick={downloadPdf}
            disabled={!reportData}
          >
            Export PDF
          </Button>
        </Box>

        
        <Paper sx={{ mb: 3 }}>
        <Tabs
    value={activeTab}
    onChange={handleTabChange}
    variant="scrollable"
    scrollButtons="auto"
  >
    <Tab label="Sales Summary" value="sales-summary" />
    <Tab label="Sales by Product" value="sales-product" />
    <Tab label="Sales by Category" value="sales-category" />
    <Tab label="Sales by Payment" value="sales-payment" />
    <Tab label="Low Stock Alerts" value="low-stock" />
    <Tab label="Inventory Valuation" value="inventory-valuation" />
    <Tab label="Top Customers" value="top-customers" />
    <Tab label="Normal Orders by Status" value="orders-status" />
    <Tab label="Custom Orders by Status" value="customorders-status" />
  </Tabs>
        </Paper>

       
        {(activeTab !== 'low-stock' && activeTab !== 'inventory-valuation') && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDateChange(e, 'start')}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDateChange(e, 'end')}
                InputLabelProps={{ shrink: true }}
              />
              {activeTab === 'sales-category' && (
                <FormControl sx={{ minWidth: 120 }}>
               
                </FormControl>
              )}
            </Box>
          </Paper>
        )}

       
        {renderReportContent()}

        
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

export default ReportsDashboard;