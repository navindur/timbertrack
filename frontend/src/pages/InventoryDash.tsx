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
  Chip,
  Button,
  Stack,
  Pagination,
  Select,
  MenuItem,
  InputAdornment,
  TextField
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AssessmentIcon from '@mui/icons-material/Assessment'; // Reports icon
import SearchHeader from '../components/SearchHeader';
import Navbar from '../components/Adminnavbar';

const InventoryDash = () => {
  const inventoryItems = [
    { id: 1, name: 'Data Big with 2 cards', code: 'RDD1', type: 'Big Chat', price: 'Rs. 24,000', quantity: 15, action: '---' },
    { id: 2, name: 'Data Big with 3 cards', code: 'AC01', type: 'Big Quill', price: 'Rs. 24,500', quantity: 8, action: '---' },
    { id: 3, name: 'Data Big with 4 cards', code: 'HQ01', type: 'Big Chat', price: 'Rs. 24,000', quantity: 22, action: '---' },
    { id: 4, name: 'Data Big with 5 cards', code: 'HQ02', type: 'Big Chat', price: 'Rs. 24,000', quantity: 5, action: '---' },
    { id: 5, name: 'Data Big with 6 cards', code: 'AC01', type: 'Big Quill', price: 'Rs. 24,500', quantity: 12, action: '---' },
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
              Inventory
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
                Add New Item
              </Button>
            </Stack>
          </Box>

          {/* Search Section */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Search by product names
            </Typography>
            <TextField
              size="small"
              placeholder="Search inventory..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
            <Chip label="Hot Times applied" variant="outlined" />
          </Stack>

          {/* Inventory Table */}
          <Paper elevation={3} sx={{ 
            mb: 3, 
            overflow: 'auto',
            width: '100%'
          }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>PRODUCT NAME</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>CODE</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>TYPE</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>PRICE</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>QUANTITY</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventoryItems.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Typography>{item.name}</Typography>
                      </TableCell>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>
                        <Chip 
                          label={item.quantity} 
                          size="small" 
                          color={item.quantity < 10 ? 'error' : 'success'}
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="text" sx={{ mr: 1 }}>
                          {item.action}
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
                value={5}
                sx={{ height: 30 }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={15}>15</MenuItem>
              </Select>
            </Stack>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {`${inventoryItems.length} of ${inventoryItems.length}`}
            </Typography>
            <Pagination count={1} shape="rounded" />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default InventoryDash;