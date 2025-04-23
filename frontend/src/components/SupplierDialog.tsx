import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack
} from '@mui/material';
import { Supplier } from '../types/supplier';
import { createSupplier, updateSupplier } from '../services/supplierService';

interface SupplierDialogProps {
  open: boolean;
  onClose: () => void;
  onSupplierSaved: () => void;
  supplier?: Supplier | null;
}

export const SupplierDialog: React.FC<SupplierDialogProps> = ({
  open,
  onClose,
  onSupplierSaved,
  supplier = null
}) => {
  const [formData, setFormData] = useState<Omit<Supplier, 'id'>>({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contact_person: supplier.contact_person,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address
      });
    } else {
      setFormData({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: ''
      });
    }
  }, [supplier]);

  const handleSubmit = async () => {
    try {
      if (supplier?.id) {
        await updateSupplier(supplier.id, formData);
      } else {
        await createSupplier(formData);
      }
      onSupplierSaved();
      onClose();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{supplier ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            name="name"
            label="Supplier Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="contact_person"
            label="Contact Person"
            value={formData.contact_person}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="phone"
            label="Phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {supplier ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};