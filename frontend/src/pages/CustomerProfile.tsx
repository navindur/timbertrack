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
import { AxiosError } from 'axios';
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

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [originalData, setOriginalData] = useState<CustomerData | null>(null);
  
  const validateName = (name: string, fieldName: string): string | null => {
    if (!name) return `${fieldName} is required`;
    if (name.length < 2 || name.length > 30) {
      return `${fieldName} must be between 2 and 30 characters`;
    }
    if (!/^[A-Z][a-z]*$/.test(name)) {
      return `${fieldName} must contain only letters`;
    }
    return null;
  };
  
  const validateEmail = (email: string): string | null => {
    if (!email) return 'Email is required';
    if (!/^(?!\.)(?!.*\.\.)[A-Z0-9._%+-]+(?<!\.)@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return 'Enter a valid email address.';
    }
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone) return null; 
    if (!/^0\d{9}$/.test(phone)) {
      return 'Phone number must start with 0 and be exactly 10 digits.';
    }
    return null;
  };

  const validateAddressLine = (line: string, fieldName = "Address"): string | null => {
     if (!line) return null; 
    if (line.length < 5 || line.length > 100) return `${fieldName} must be 5–100 characters long`;
    if (!/^[A-Za-z0-9\s,'-.]+$/.test(line)) return `${fieldName} contains invalid characters`;
    return null;
  };
  
  const validateCity = (city: string): string | null => {
    if (!city) return null; 
    if (city.length < 2 || city.length > 50) return 'City must be 2–50 characters long';
    if (!/^[A-Za-z\s]+$/.test(city)) return 'City must contain only letters and spaces';
    return null;
  };
  

  const validatePostalCode = (code: string): string | null => {
    if (!code) return null;
    if (!/^[0-9]{5}$/.test(code)) return 'Postal code must be exactly 5 digits';
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return 'Must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Must contain uppercase letter';
    if (!/[a-z]/.test(password)) return 'Must contain lowercase letter';
    if (!/[0-9]/.test(password)) return 'Must contain number';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Must contain special character';
    return null;
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const response = await axiosInstance.get(`/customers/${user.id}`);
        setCustomerData(response.data);
        setOriginalData(response.data); 
      } catch (err) {
        setError('Failed to fetch customer data');
      }
    };
    fetchCustomerData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'first_name' || name === 'last_name') {
      if (value.length === 1) {
        processedValue = value.toUpperCase();
      } else if (value.length > 1) {
        processedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      }
    }
   
    else if (name === 'email') {
      processedValue = value.toLowerCase();
    }

    setCustomerData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
 
    const nameErrors = {
      first: validateName(customerData.first_name, 'First name'),
      last: validateName(customerData.last_name, 'Last name')
    };
  
    if (nameErrors.first || nameErrors.last) {
      setError(nameErrors.first || nameErrors.last || '');
      return;
    }
  
    if (customerData.first_name.toLowerCase() === customerData.last_name.toLowerCase()) {
      setError('First name and last name cannot be the same');
      return;
    }
  
    const emailError = validateEmail(customerData.email);
    if (emailError) {
      setError(emailError);
      return;
    }
  
    const phoneError = validatePhone(customerData.phone_num);
    if (phoneError) {
      setError(phoneError);
      return;
    }
  
    const postalError = validatePostalCode(customerData.postal_code || '');
    if (postalError) {
      setError(postalError);
      return;
    }
  
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axiosInstance.put(`/customers/${user.id}`, customerData);
      
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.data?.message === 'Email already in use by another account' || 
            err.response?.data?.errorType === 'EMAIL_CONFLICT') {
          setError('Email already in use by another account');
        } else {
          setError(err.response?.data?.message || 'Failed to update profile');
        }
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  

  const handleCancel = () => {
    if (originalData) {
      setCustomerData(originalData); 
    }
    setIsEditing(false);
    setError('');
  };

  const handleOpenPasswordDialog = () => {
    setError('');
    setSuccess('');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setOpenPasswordDialog(true);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const passwordError = validatePassword(passwordData.newPassword);
    if (passwordError) {
      setError(passwordError);
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
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
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
              error={!!validateName(customerData.first_name, 'First name')}
              helperText={validateName(customerData.first_name, 'First name')}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
            
            <TextField
              label="Last Name"
              name="last_name"
              value={customerData.last_name}
              onChange={handleInputChange}
              error={!!validateName(customerData.last_name, 'Last name')}
              helperText={validateName(customerData.last_name, 'Last name')}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
            
            <TextField
              label="Email"
              name="email"
              value={customerData.email}
              onChange={handleInputChange}
              error={!!validateEmail(customerData.email)}
              helperText={validateEmail(customerData.email)}
              fullWidth
              margin="normal"
              disabled={!isEditing}
              inputProps={{ style: { textTransform: 'lowercase' } }}
              />
            
            <TextField
              label="Phone Number"
              name="phone_num"
              value={customerData.phone_num}
              onChange={handleInputChange}
              error={!!validatePhone(customerData.phone_num)}
              helperText={validatePhone(customerData.phone_num)}
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
              error={!!validateAddressLine(customerData.address_line1 || '', 'Address Line 1')}
              helperText={validateAddressLine(customerData.address_line1 || '', 'Address Line 1')}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
            
            <TextField
              label="Address Line 2"
              name="address_line2"
              value={customerData.address_line2 || ''}
              onChange={handleInputChange}
              error={!!validateAddressLine(customerData.address_line2 || '', 'Address Line 2')}
              helperText={validateAddressLine(customerData.address_line2 || '', 'Address Line 2') || 'Optional'}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
            
            <TextField
              label="City"
              name="city"
              value={customerData.city || ''}
              onChange={handleInputChange}
              error={!!validateCity(customerData.city || '')}
              helperText={validateCity(customerData.city || '')}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
            
            <TextField
              label="Postal Code"
              name="postal_code"
              value={customerData.postal_code || ''}
              onChange={handleInputChange}
              error={!!validatePostalCode(customerData.postal_code || '')}
              helperText={validatePostalCode(customerData.postal_code || '')}
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
                  onClick={() => navigate('/forgot-password')}
                  sx={{ mr: 2 }}
                >
                  Forget Password
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
                  onClick={handleCancel}
                  
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </Paper>

        
        <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
          <DialogTitle>Change Password</DialogTitle>
         
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            
            <TextField
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
              error={!!validatePassword(passwordData.newPassword) && passwordData.newPassword.length > 0}
              helperText={
                passwordData.newPassword.length > 0 
                  ? validatePassword(passwordData.newPassword) || 'Password meets requirements' 
                  : 'At least 8 characters with uppercase, lowercase, number, and special character'
              }
            />
            
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              margin="normal"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              error={passwordData.confirmPassword.length > 0 && 
                    passwordData.newPassword !== passwordData.confirmPassword}
              helperText={
                passwordData.confirmPassword.length > 0 && 
                passwordData.newPassword !== passwordData.confirmPassword 
                  ? 'Passwords do not match' 
                  : ''
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
            <Button 
              onClick={handlePasswordChange} 
              variant="contained"
              disabled={
                !passwordData.currentPassword || 
                !passwordData.newPassword || 
                !passwordData.confirmPassword ||
                !!validatePassword(passwordData.newPassword) ||
                passwordData.newPassword !== passwordData.confirmPassword
              }
            >
              Change Password
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Footer />
    </>
  );
};

export default CustomerProfile;