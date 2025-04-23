import React, { useEffect, useState } from 'react';
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
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import  SearchHeader  from '../components/SearchHeader';
import Navbar  from '../components/Adminnavbar';
import { SupplierDialog } from '../components/SupplierDialog';
import { Supplier } from '../types/supplier';
import { getSuppliers as getAllSuppliers, deleteSupplier } from '../services/supplierService';

const SuppliersDash: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSuppliers = async () => {
    try {
      const data = await getAllSuppliers();
      setSuppliers(data);
    } catch (error) {
      showSnackbar('Failed to load suppliers', 'error');
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSupplier(id);
      fetchSuppliers();
      showSnackbar('Supplier deleted successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to delete supplier', 'error');
      console.error('Delete error:', error);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#efdecd' }}>
      <Navbar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: '240px' }}>
        <SearchHeader onSearchChange={setSearchTerm} />
        
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4" fontWeight="bold">Suppliers</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setCurrentSupplier(null);
              setOpenDialog(true);
            }}
            sx={{
              bgcolor: '#B88E2F',
              '&:hover': { bgcolor: '#A63A06' }
            }}
          >
            Add Supplier
          </Button>
        </Box>

        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id} hover>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.contact_person}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton onClick={() => {
                          setCurrentSupplier(supplier);
                          setOpenDialog(true);
                        }}>
                          <Edit sx={{ color: '#B88E2F' }} />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(supplier.id)}>
                          <Delete sx={{ color: '#A63A06' }} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <SupplierDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSupplierSaved={fetchSuppliers}
          supplier={currentSupplier}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default SuppliersDash;