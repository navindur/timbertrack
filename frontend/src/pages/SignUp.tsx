import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Link, Alert } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import Footer from '../components/Footer'; 
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axiosInstance from '../api/axiosInstance';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_num: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
  
    // Auto-capitalize first letter for name fields
    if (e.target.name === 'first_name' || e.target.name === 'last_name') {
      if (value.length === 1) {
        value = value.toUpperCase();
      } else if (value.length > 1) {
        value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      }
    }
    // Convert email to lowercase as user types
    else if (e.target.name === 'email') {
      value = value.toLowerCase();
    }
  
    setFormData({ ...formData, [e.target.name]: value });
  };

  const validateForm = () => {
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
      return 'All fields are required.';
    }
    // First name validation
  if (!/^[A-Z][a-z]*$/.test(formData.first_name)) {
    return 'First name must contain only letters.';
  }

  // First name length: 2 to 30 characters
if (formData.first_name.length < 2 || formData.first_name.length > 30) {
  return 'First name must be between 2 and 30 characters.';
}

  // Last name validation
  if (!/^[A-Z][a-z]*$/.test(formData.last_name)) {
    return 'Last name must contain only letters.';
  }

  // Last name length: 2 to 30 characters
if (formData.last_name.length < 2 || formData.last_name.length > 30) {
  return 'Last name must be between 2 and 30 characters.';
}


  // First and last name cannot be same
  if (formData.first_name.toLowerCase() === formData.last_name.toLowerCase()) {
    return 'First name and last name cannot be the same.';
  }


  if (!/^(?!\.)(?!.*\.\.)[A-Z0-9._%+-]+(?<!\.)@[A-Z0-9.-]+\.[A-Z]{2,}$/i
.test(formData.email)) {
    return 'Enter a valid email address.';
  }

  if (formData.password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  if (formData.password.length > 64) {
    return 'Password must not exceed 64 characters.';
  }
  if (/\s/.test(formData.password)) {
    return 'Password must not contain spaces or tabs.';
  }
  if (!/[A-Z]/.test(formData.password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[a-z]/.test(formData.password)) {
    return 'Password must contain at least one lowercase letter.';
  }
  if (!/[0-9]/.test(formData.password)) {
    return 'Password must contain at least one number.';
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
    return 'Password must contain at least one special character.';
  }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/signup', formData);

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate('/signin'), 2000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Grid container spacing={10}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: '500px',
                backgroundImage: 'url(/signup.png)', 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '8px',
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                <span style={{ color: '#C24507' }}>Timber</span>
                <span style={{ color: '#1C486F' }}>Track</span>
              </Typography>

              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                Create an account
              </Typography>

              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">Signup successful! Redirecting...</Alert>}

              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      variant="outlined"
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type="password"
                      variant="outlined"
                      required
                      size="small"
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    marginTop: '1rem',
                    backgroundColor: '#B88E2F',
                    '&:hover': { backgroundColor: '#A03A06' },
                  }}
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '1rem', marginBottom: '1rem' }}>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
                <Typography variant="body1" sx={{ margin: '0 0.5rem', color: '#757575' }}>
                  OR
                </Typography>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{
                  marginBottom: '1rem',
                  color: '#757575',
                  borderColor: '#E0E0E0',
                  '&:hover': { borderColor: '#C24507', color: '#C24507' },
                }}
              >
                Sign up with Google
              </Button>

              <Typography variant="body1" sx={{ color: '#757575' }}>
                Already have an account?{' '}
                <Link
                  component="button"
                  sx={{ color: '#B88E2F', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate('/signin')}
                >
                  Log In
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </div>
  );
};

export default SignUp;