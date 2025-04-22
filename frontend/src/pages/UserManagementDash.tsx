import React, { useState } from 'react';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchHeader from '../components/SearchHeader';
import Navbar from '../components/Adminnavbar';

// Type definitions
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
};

type Customer = {
  id: number;
  name: string;
  email: string;
  contact: string;
  orders: number;
};

const UserManagementDash = () => {
  // Sample data with proper typing
  const salesPersons: User[] = [
    { id: 1, name: 'John Smith', email: 'john@timbertrack.com', role: 'Sales', status: 'Active', lastLogin: '2 hours ago' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@timbertrack.com', role: 'Sales', status: 'Active', lastLogin: '1 day ago' },
    { id: 3, name: 'Michael Brown', email: 'michael@timbertrack.com', role: 'Sales', status: 'Inactive', lastLogin: '1 week ago' },
  ];

  const customers: Customer[] = [
    { id: 1, name: 'BuildRight Constructions', email: 'contact@buildright.com', contact: '0712345678', orders: 12 },
    { id: 2, name: 'WoodCraft Furniture', email: 'info@woodcraft.com', contact: '0723456789', orders: 8 },
    { id: 3, name: 'Timber Solutions Ltd', email: 'sales@timbersolutions.com', contact: '0734567890', orders: 15 },
  ];

  // State with proper typing
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleAddUser = () => {
    setOpenAddUser(true);
  };

  const handleDeleteUser = (user: User) => {
    setCurrentUser(user);
    setOpenDeleteConfirm(true);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      bgcolor: '#efdecd'
    }}>
      {/* Navbar */}
      <Box sx={{ 
        width: 240, 
        flexShrink: 0,
        position: 'fixed',
        height: '100vh'
      }}>
        <Navbar />
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ 
        flexGrow: 1,
        p: 3,
        ml: '240px',
        width: 'calc(100% - 240px)',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}>
        <SearchHeader 
          userName="Admin"
          onSearchChange={(value) => console.log(value)}
        />

        {/* Content Container */}
        <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
          {/* Sales Persons Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Sales Team Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={handleAddUser}
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
                Add Sales Person
              </Button>
            </Box>

            <Paper elevation={3} sx={{ mb: 3, overflow: 'auto' }}>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>NAME</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>EMAIL</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>ROLE</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>STATUS</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>LAST LOGIN</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>ACTIONS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salesPersons.map((person) => (
                      <TableRow key={person.id} hover>
                        <TableCell>{person.name}</TableCell>
                        <TableCell>{person.email}</TableCell>
                        <TableCell>{person.role}</TableCell>
                        <TableCell>
                          <Chip 
                            label={person.status} 
                            color={person.status === 'Active' ? 'success' : 'error'} 
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{person.lastLogin}</TableCell>
                        <TableCell>
                          <IconButton size="small" sx={{ color: '#B88E2F' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            sx={{ color: '#d32f2f' }}
                            onClick={() => handleDeleteUser(person)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>

          {/* Customers Section */}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Customer Directory
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
              View-only access to customer information
            </Typography>

            <Paper elevation={3} sx={{ overflow: 'auto' }}>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>COMPANY</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>EMAIL</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>CONTACT</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>ORDERS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id} hover>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.contact}</TableCell>
                        <TableCell>{customer.orders}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Add User Dialog */}
      <Dialog open={openAddUser} onClose={() => setOpenAddUser(false)}>
        <DialogTitle>Add New Sales Person</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 400 }}>
            <TextField fullWidth label="Full Name" variant="outlined" />
            <TextField fullWidth label="Email" variant="outlined" />
            <TextField fullWidth label="Temporary Password" variant="outlined" />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select label="Role" defaultValue="Sales">
                <MenuItem value="Sales">Sales Person</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddUser(false)}>Cancel</Button>
          <Button 
            variant="contained"
            sx={{ backgroundColor: '#B88E2F', color: '#fff' }}
          >
            Create Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove {currentUser?.name} from the sales team?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirm(false)}>Cancel</Button>
          <Button 
            variant="contained"
            sx={{ backgroundColor: '#d32f2f', color: '#fff' }}
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagementDash;