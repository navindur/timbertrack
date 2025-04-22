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
  Chip,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SearchHeader from '../components/SearchHeader';
import Navbar from '../components/Adminnavbar';

const SuppliersDash = () => {
  const suppliers = [
    { id: 1, name: 'Samatha Silva', email: 'kdmaxnimai@gmail.com', phone: '0701232456' },
    { id: 2, name: 'Samatha Silva', email: 'kdmaxnimai@gmail.com', phone: '0701232456' },
    { id: 3, name: 'Samatha Silva', email: 'kdmaxnimai@gmail.com', phone: '0701232456' },
    { id: 4, name: 'Samatha Silva', email: 'kdmaxnimai@gmail.com', phone: '0701232456' },
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
          {/* Page Title and Add Button */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Suppliers
            </Typography>
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
              Add Supplier
            </Button>
          </Box>

          {/* Search Section */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Search by Supplier name
            </Typography>
            <TextField
              size="small"
              placeholder="Search suppliers..."
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

          {/* Suppliers Table */}
          <Paper elevation={3} sx={{ 
            mb: 3, 
            overflow: 'auto',
            width: '100%'
          }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>SUPPLIER NAME</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>EMAIL</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>CONTACT NUMBER</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} colSpan={2}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconButton size="small" sx={{ color: '#B88E2F' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <Typography>{supplier.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          sx={{
                            textTransform: 'none',
                            color: '#B88E2F',
                            borderColor: '#B88E2F',
                            '&:hover': {
                              backgroundColor: '#f5f5f5',
                              borderColor: '#A63A06'
                            }
                          }}
                        >
                          Create Order
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          sx={{
                            textTransform: 'none',
                            color: '#6c757d',
                            borderColor: '#6c757d',
                            '&:hover': {
                              backgroundColor: '#f5f5f5',
                              borderColor: '#5a6268'
                            }
                          }}
                        >
                          Order History
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
            </Stack>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {`${suppliers.length} of ${suppliers.length}`}
            </Typography>
            <Pagination count={1} shape="rounded" />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default SuppliersDash;