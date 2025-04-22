import React from 'react';
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
  Stack,
  Pagination,
  Select,
  MenuItem,
  InputAdornment,
  TextField,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SearchHeader from '../components/SearchHeader';
import Navbar from '../components/Adminnavbar';

const OrdersDash = () => {
  const orders = [
    { id: 1, customer: 'John Smith', code: 'ROC01', type: 'Bg Chair', quantity: 1, price: 'Rs. 25,789' },
    { id: 2, customer: 'Sarah Johnson', code: '#B001', type: 'Bg Chair', quantity: 1, price: 'Rs. 25,789' },
    { id: 3, customer: 'Michael Brown', code: 'ROC01', type: 'Bg Chair', quantity: 1, price: 'Rs. 25,789' },
    { id: 4, customer: 'Emily Davis', code: '#B001', type: 'Bg Chair', quantity: 1, price: 'Rs. 25,789' },
  ];

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

      {/* Main Content - Takes remaining space */}
      <Box component="main" sx={{ 
        flexGrow: 1,
        p: 3,
        ml: '240px',
        width: 'calc(100% - 240px)',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}>
        {/* Search Header */}
        <SearchHeader 
          userName="Navindu"
          onSearchChange={(value) => console.log(value)}
        />

        {/* Content Container */}
        <Box sx={{
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          {/* Page Title and Buttons */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Orders
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<AssessmentIcon />}
                sx={{
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  borderRadius: '8px',
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#5a6268',
                    boxShadow: 'none'
                  }
                }}
              >
                Generate Report
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: '#B88E2F',
                  color: '#fff',
                  borderRadius: '8px',
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#A63A06',
                    boxShadow: 'none'
                  }
                }}
              >
                Create Order
              </Button>
            </Stack>
          </Box>

          {/* Search Section */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Search by Customer name
            </Typography>
            <TextField
              size="small"
              placeholder="Search orders..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
            <Chip label="No filters applied" variant="outlined" />
          </Stack>

          {/* Orders Table */}
          <Paper elevation={3} sx={{ 
            mb: 3, 
            overflow: 'auto',
            width: '100%'
          }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>CUSTOMER NAME</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>CODE</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>TYPE</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>QUANTITY</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>TOTAL PRICE</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>LAST 7 DAYS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography>{order.customer}</Typography>
                      </TableCell>
                      <TableCell>{order.code}</TableCell>
                      <TableCell>{order.type}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.price}</TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          startIcon={<DescriptionIcon />}
                          sx={{
                            textTransform: 'none',
                            color: '#B88E2F',
                            '&:hover': {
                              backgroundColor: 'transparent',
                              color: '#A63A06'
                            }
                          }}
                        >
                          View invoice
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Pagination */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center">
              <Typography variant="body2" sx={{ mr: 1 }}>
                Rows per page:
              </Typography>
              <Select
                size="small"
                value={4}
                sx={{ height: 30 }}
              >
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={12}>12</MenuItem>
              </Select>
              <Typography variant="body2" sx={{ ml: 2 }}>
                % of 7
              </Typography>
            </Stack>
            <Pagination count={1} shape="rounded" />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default OrdersDash;