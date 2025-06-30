import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Box,
  Typography,
  InputAdornment
} from '@mui/material';
import { Edit, Delete, Add, Search } from '@mui/icons-material';
import Navbar from '../components/Adminnavbar';

interface Supplier {
  id?: number;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at?: Date;
}
interface SupplierErrors {
  name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const SupplierList: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState<SupplierErrors>({});


  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const filtered = suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  }, [searchTerm, suppliers]);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/suppliers');
      const data = await response.json();
      setSuppliers(data);
      setFilteredSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch suppliers',
        severity: 'error'
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenAddDialog = () => {
    setCurrentSupplier({
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: ''
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentSupplier(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentSupplier(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentSupplier) return;
    setCurrentSupplier({
      ...currentSupplier,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!currentSupplier) return;
 if (validateForm()) {
    try {
      const url = currentSupplier.id
        ? `http://localhost:5000/api/suppliers/${currentSupplier.id}`
        : 'http://localhost:5000/api/suppliers';
      const method = currentSupplier.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentSupplier),
      });

      if (!response.ok) throw new Error('Operation failed');

      setSnackbar({
        open: true,
        message: currentSupplier.id ? 'Supplier updated successfully' : 'Supplier added successfully',
        severity: 'success'
      });
      fetchSuppliers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving supplier:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save supplier',
        severity: 'error'
      });
    }
  }
  };

  const handleDelete = async () => {
    if (!currentSupplier?.id) return;

    try {
      const response = await fetch(`http://localhost:5000/api/suppliers/${currentSupplier.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      setSnackbar({
        open: true,
        message: 'Supplier deleted successfully',
        severity: 'success'
      });
      fetchSuppliers();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting supplier:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete supplier',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validateForm = () => {
  const newErrors: SupplierErrors = {};

  if (!currentSupplier?.name?.trim()) {
    newErrors.name = 'Supplier Name is required';
  } else if (!/^[A-Za-z0-9 ]{2,60}$/.test(currentSupplier.name)) {
    newErrors.name = 'Must be 2–60 characters, only letters, numbers, spaces';
  }
  if (!currentSupplier?.contact_person?.trim()) {
    newErrors.contact_person = 'Contact Person is required';
  } else if (!/^[A-Za-z ]{2,60}$/.test(currentSupplier.contact_person)) {
    newErrors.contact_person = 'Must be 2–60 letters only (no numbers/symbols)';
  }

  if (currentSupplier?.email?.trim()) {
    const emailRegex = /^(?!\.)(?!.*\.\.)[A-Z0-9._%+-]+(?<!\.)@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(currentSupplier.email)) {
      newErrors.email = 'Invalid email format';
    }
  }

  if (!currentSupplier?.phone?.trim()) {
    newErrors.phone = 'Phone number is required';
  } else if (!/^0\d{9}$/.test(currentSupplier.phone)) {
    newErrors.phone = 'Must start with 0 and be exactly 10 digits';
  }

  if (!currentSupplier?.address?.trim()) {
    newErrors.address = 'Address is required';
  } else if (!/^[A-Za-z0-9\s,'-./]{5,100}$/.test(currentSupplier.address)) {
    newErrors.address = 'Must be 5–100 characters, only valid characters allowed';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
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
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="text-gray-800 font-bold">
            Supplier Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleOpenAddDialog}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Supplier
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search suppliers by name"
            sx={{ width: 425 }}
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
  
        <Paper elevation={3} className="rounded-lg overflow-hidden">
          <TableContainer>
            <Table>
              <TableHead className="bg-gray-100">
                <TableRow>
                  <TableCell className="font-bold">Name</TableCell>
                  <TableCell className="font-bold">Contact Person</TableCell>
                  <TableCell className="font-bold">Email</TableCell>
                  <TableCell className="font-bold">Phone</TableCell>
                  <TableCell className="font-bold">Address</TableCell>
                  <TableCell className="font-bold">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id} hover>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.contact_person || '-'}</TableCell>
                      <TableCell>{supplier.email || '-'}</TableCell>
                      <TableCell>{supplier.phone || '-'}</TableCell>
                      <TableCell>{supplier.address || '-'}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenEditDialog(supplier)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleOpenDeleteDialog(supplier)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      {searchTerm ? 'No matching suppliers found' : 'No suppliers available'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
  
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md" disableEnforceFocus disableAutoFocus>
          <DialogTitle>
            {currentSupplier?.id ? 'Edit Supplier' : 'Add New Supplier'}
          </DialogTitle>
          <DialogContent className="space-y-4 pt-4">
            <TextField
  fullWidth
  label="Supplier Name"
  name="name"
  value={currentSupplier?.name || ''}
  onChange={handleInputChange}
  variant="outlined"
  required
  error={!!errors.name}
  helperText={errors.name}
/>

<TextField
  fullWidth
  label="Contact Person"
  name="contact_person"
  value={currentSupplier?.contact_person || ''}
  onChange={handleInputChange}
  variant="outlined"
  required
  error={!!errors.contact_person}
  helperText={errors.contact_person}
/>

<TextField
  fullWidth
  label="Email"
  name="email"
  type="email"
  value={currentSupplier?.email || ''}
  onChange={handleInputChange}
  variant="outlined"
  error={!!errors.email}
  helperText={errors.email}
/>

<TextField
  fullWidth
  label="Phone"
  name="phone"
  value={currentSupplier?.phone || ''}
  onChange={handleInputChange}
  variant="outlined"
  required
  error={!!errors.phone}
  helperText={errors.phone}
/>

<TextField
  fullWidth
  label="Address"
  name="address"
  multiline
  rows={3}
  value={currentSupplier?.address || ''}
  onChange={handleInputChange}
  variant="outlined"
  required
  error={!!errors.address}
  helperText={errors.address}
/>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {currentSupplier?.id ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
  
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete supplier "{currentSupplier?.name}"?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
  
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default SupplierList;