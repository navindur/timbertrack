import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, Add, Search, Inventory as InventoryIcon } from '@mui/icons-material';
import Navbar from '../components/Adminnavbar';

interface InventoryItem {
  inventory_id?: number;
  name: string;
  type: string;
  price: number;
  quantity: number;
  reorder_level: number;
  supplier_id: number;
  is_active?: boolean;
  created_at?: Date;
}

const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchInventory();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const filtered = inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [searchTerm, inventory]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/inventory');
      if (!response.ok) throw new Error('Failed to fetch inventory');
      
      const data = await response.json();
      const processedData = data.map((item: any) => ({
        ...item,
        price: Number(item.price),
        quantity: Number(item.quantity),
        reorder_level: Number(item.reorder_level)
      }));
      
      setInventory(processedData);
      setFilteredInventory(processedData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to fetch inventory',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/suppliers');
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenAddDialog = () => {
    setCurrentItem({
      name: '',
      type: '',
      price: 0,
      quantity: 0,
      reorder_level: 0,
      supplier_id: 0
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (item: InventoryItem) => {
    setCurrentItem(item);
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (item: InventoryItem) => {
    setCurrentItem(item);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentItem(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentItem(null);
  };

const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setCurrentItem(prev => {
    if (!prev) return prev;
    return {
      ...prev,
      [e.target.name]: e.target.name === 'price' || 
                       e.target.name === 'quantity' || 
                       e.target.name === 'reorder_level'
        ? Number(e.target.value)
        : e.target.value
    };
  });
}, []); // Empty dependency array since we only use prev state

  const handleSelectChange = (e: any) => {
    if (!currentItem) return;
    setCurrentItem({
      ...currentItem,
      [e.target.name]: Number(e.target.value)
    });
  };

  const handleSubmit = async () => {
    if (!currentItem) return;

    try {
      const payload = {
        ...currentItem,
        is_active: true
      };

      const url = currentItem.inventory_id
        ? `http://localhost:5000/api/inventory/${currentItem.inventory_id}`
        : 'http://localhost:5000/api/inventory';
      const method = currentItem.inventory_id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Operation failed');

      setSnackbar({
        open: true,
        message: currentItem.inventory_id ? 'Inventory item updated successfully' : 'Inventory item added successfully',
        severity: 'success'
      });
      fetchInventory();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving inventory item:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save inventory item',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    if (!currentItem?.inventory_id) return;

    try {
      const response = await fetch(`http://localhost:5000/api/inventory/${currentItem.inventory_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      setSnackbar({
        open: true,
        message: 'Inventory item deleted successfully',
        severity: 'success'
      });
      fetchInventory();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete inventory item',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const InventoryTable = () => (
    <Paper elevation={3} className="rounded-lg overflow-hidden">
      <TableContainer>
        <Table>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-bold">Name</TableCell>
              <TableCell className="font-bold">Type</TableCell>
              <TableCell className="font-bold">Price</TableCell>
              <TableCell className="font-bold">Quantity</TableCell>
              <TableCell className="font-bold">Reorder Level</TableCell>
              <TableCell className="font-bold">Supplier</TableCell>
              <TableCell className="font-bold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <TableRow key={item.inventory_id} hover>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>Rs.{Number(item.price).toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.reorder_level}</TableCell>
                  <TableCell>
                    {suppliers.find(s => s.id === item.supplier_id)?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEditDialog(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleOpenDeleteDialog(item)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {searchTerm ? 'No matching inventory items found' : 'No inventory items available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  
  const InventoryFormDialog = () => {
    const [isMounted, setIsMounted] = useState(false);
    const activeElementRef = useRef<HTMLElement | null>(null);
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      console.log('Dialog re-rendered');
    });
  
    // Track active element before potential re-renders
    useEffect(() => {
      const handleFocusIn = (e: FocusEvent) => {
        activeElementRef.current = e.target as HTMLElement;
      };
      document.addEventListener('focusin', handleFocusIn);
      return () => document.removeEventListener('focusin', handleFocusIn);
    }, []);
  
    // Restore focus after re-renders
    useEffect(() => {
      if (isMounted && activeElementRef.current) {
        // Special handling for Select dropdown
        if (activeElementRef.current.classList.contains('MuiSelect-nativeInput')) {
          if (selectRef.current) {
            const selectButton = selectRef.current.querySelector('.MuiSelect-select') as HTMLElement;
            selectButton?.focus();
          }
        } else {
          activeElementRef.current.focus();
        }
      }
    });
  
    // Initial focus when dialog opens
    useEffect(() => {
      if (openDialog && !isMounted) {
        setIsMounted(true);
        const timer = setTimeout(() => {
          const nameInput = document.querySelector('[name="name"]') as HTMLInputElement;
          nameInput?.focus();
        }, 50);
        return () => clearTimeout(timer);
      }
      if (!openDialog) {
        setIsMounted(false);
      }
    }, [openDialog, isMounted]);
  
    return (
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        disableEnforceFocus
        disableRestoreFocus
        disableAutoFocus
      >
        <DialogTitle>
          {currentItem?.inventory_id ? 'Edit Inventory Item' : 'Add New Inventory Item'}
        </DialogTitle>
        <DialogContent className="space-y-4 pt-4">
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={currentItem?.name || ''}
            onChange={handleInputChange}
            variant="outlined"
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Type"
            name="type"
            value={currentItem?.type || ''}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={currentItem?.price || 0}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
            InputProps={{
              startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
            }}
            inputProps={{
              step: "0.01"
            }}
          />
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            value={currentItem?.quantity || 0}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Reorder Level"
            name="reorder_level"
            type="number"
            value={currentItem?.reorder_level || 0}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
          />
         <FormControl fullWidth margin="normal">
          <InputLabel>Supplier</InputLabel>
          <Select
            ref={selectRef}
            name="supplier_id"
            value={currentItem?.supplier_id || 0}
            onChange={handleSelectChange}
            label="Supplier"
            MenuProps={{
              disablePortal: true, // Helps with focus management
              disableAutoFocus: true, // Prevents focus stealing
              disableEnforceFocus: true, // Prevents focus containment
            }}
          >
            <MenuItem value={0}>Select Supplier</MenuItem>
            {suppliers.map(supplier => (
              <MenuItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="secondary">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={!currentItem?.name || !currentItem?.type}
        >
          {currentItem?.inventory_id ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
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
      {/* Navbar - Fixed width */}
      <Box sx={{ 
        width: 240, 
        flexShrink: 0,
        position: 'fixed',
        height: '100vh'
      }}>
        <Navbar />
      </Box>
  
      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1,
        p: 3,
        ml: 30,
        width: `calc(100% - 240px)`
      }}>
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="text-gray-800 font-bold">
            
            Inventory Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleOpenAddDialog}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Item
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search inventory by name or type..."
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
  
        <InventoryTable />
        <InventoryFormDialog />
  
        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete inventory item "{currentItem?.name}"?
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
  
        {/* Snackbar Notification */}
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

export default InventoryPage;