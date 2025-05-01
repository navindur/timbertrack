import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AxiosError } from 'axios'; // Import AxiosError
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

interface CustomerData {
  first_name: string;
  last_name: string;
  email: string;
  phone_num: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
}

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<CustomerData>({
    first_name: '',
    last_name: '',
    email: '',
    phone_num: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const response = await axiosInstance.get(`/customers/${user.id}`);
        setCustomerData(response.data);
      } catch (err) {
        setError('Failed to fetch customer data');
      }
    };
    fetchCustomerData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await axiosInstance.put(`/customers/${user.id}`, customerData);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    }
  };
  const handleOpenPasswordDialog = () => {
    setError('');
    setSuccess('');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    // Small delay to ensure state is cleared
    setTimeout(() => {
      setOpenPasswordDialog(true);
    }, 50);
  };
  // Add this effect
  useEffect(() => {
    if (!openPasswordDialog) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [openPasswordDialog]);
  

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
  
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await axiosInstance.put('/auth/change-password', {
        userId: user.id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Password changed successfully');
      setOpenPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) { // Specify 'unknown' type for the error
      // Type assertion to AxiosError
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Failed to change password');
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  return (
    <>
    <Navbar />
    <Box sx={{ p: 4 }}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
    <Button variant="contained" onClick={() => navigate('/allorderview')}>
      View Orders
    </Button>
  </Box>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Personal Information</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <TextField
            label="First Name"
            name="first_name"
            value={customerData.first_name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Last Name"
            name="last_name"
            value={customerData.last_name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Email"
            name="email"
            value={customerData.email}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            label="Phone Number"
            name="phone_num"
            value={customerData.phone_num}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Address Information</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <TextField
            label="Address Line 1"
            name="address_line1"
            value={customerData.address_line1 || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Address Line 2"
            name="address_line2"
            value={customerData.address_line2 || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="City"
            name="city"
            value={customerData.city || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Postal Code"
            name="postal_code"
            value={customerData.postal_code || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          {!isEditing ? (
            <>
              <Button 
                variant="contained" 
                onClick={() => setIsEditing(true)}
                sx={{ mr: 2 }}
              >
                Edit Profile
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleOpenPasswordDialog} 
                sx={{ mr: 2 }}
              >
                Change Password
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="contained" 
                onClick={handleSave}
                sx={{ mr: 2 }}
              >
                Save Changes
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Paper>

      {/* Change Password Dialog */}
      <Dialog 
  key={String(openPasswordDialog)} // Add this
  open={openPasswordDialog}
  onClose={() => setOpenPasswordDialog(false)}
>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
        <TextField
      key={`current-${String(openPasswordDialog)}`}
      label="Current Password"
      type="password"
      fullWidth
      margin="normal"
      value={passwordData.currentPassword}
      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
    />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            margin="normal"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained">Change Password</Button>
        </DialogActions>
      </Dialog>
    </Box>
    <Footer />
    </>
  );
};

export default CustomerProfile;