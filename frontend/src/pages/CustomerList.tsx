//all customer details to owner
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
  Typography,
  Box,
  Pagination,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Adminnavbar';
import { fetchCustomers } from '../services/customerinfoService';

interface Customer {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_num: string;
  address: string;
  city: string;
  postal_code: string;
  created_at: string;
  order_count: number;
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomers = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCustomers(page, limit, searchTerm);
        setCustomers(data.customers);
        setTotalCustomers(data.total);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCustomers();
  }, [page, limit, searchTerm]);

  //handle pagination change
  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
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
        ml: '240px',
        width: `calc(100% - 240px)`
      }}>
        <Typography variant="h4" gutterBottom>
          Customer Directory
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            placeholder="Search by name, email, or phone"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); //reset to first page on mew search
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 400 }}
          />
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
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Orders</TableCell>
                    <TableCell>Member Since</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.customer_id}>
                      <TableCell>#{customer.customer_id}</TableCell>
                      <TableCell>{customer.first_name} {customer.last_name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone_num}</TableCell>
                      <TableCell>
                        {customer.city}, {customer.postal_code}
                      </TableCell>
                      <TableCell>{customer.order_count}</TableCell>
                      <TableCell>
                        {new Date(customer.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/customerinfo/${customer.customer_id}`)}
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
                count={Math.ceil(totalCustomers / limit)}
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

export default CustomerList;