import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Link, Alert } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import Footer from '../components/Footer'; 
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  // State for form inputs (removed phone field)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  // State for error messages
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form validation function (removed phone validation)
  const validateForm = () => {
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
      return 'All fields are required.';
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Enter a valid email address.';
    }
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters.';
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Signup failed. Try again.');
      }

      setSuccess(true);
      setTimeout(() => navigate('/signin'), 2000); // Redirect after 2s
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <Navbar />
      {/* Main Content */}
      <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Grid container spacing={10}>
          {/* Left Side: Image */}
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

          {/* Right Side: Sign Up Form */}
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
              {/* Logo or Title */}
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                <span style={{ color: '#C24507' }}>Timber</span>
                <span style={{ color: '#1C486F' }}>Track</span>
              </Typography>

              {/* Sign Up Form */}
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                Create an account
              </Typography>

              {/* Error or Success Message */}
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

                {/* Create Account Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    marginTop: '1rem',
                    backgroundColor: '#B88E2F',
                    '&:hover': { backgroundColor: '#A03A06' },
                  }}
                >
                  Create Account
                </Button>
              </Box>

              {/* Divider */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '1rem', marginBottom: '1rem' }}>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
                <Typography variant="body1" sx={{ margin: '0 0.5rem', color: '#757575' }}>
                  OR
                </Typography>
                <Box sx={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
              </Box>

              {/* Sign Up with Google */}
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

              {/* Already have an account? Log In */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SignUp;
