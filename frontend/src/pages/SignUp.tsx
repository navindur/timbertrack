import React from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Link } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import Footer from '../components/Footer'; // Import Footer from components folder
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SignUp: React.FC = () => {
  const navigate = useNavigate(); // Create a navigate function

  return (
    <div>
      {/* Main Content */}
      <Container maxWidth="md" sx={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Grid container spacing={10}>
          {/* Left Side: Image */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: '500px',
                backgroundImage: 'url(/signup.png)', // Replace with your image path
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
                <span style={{ color: '#1C486F' }}>Track</span> {/* Dark blue color */}
              </Typography>

              {/* Sign Up Form */}
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                Create an account
              </Typography>
              <Box component="form" sx={{ width: '100%' }}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      variant="outlined"
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      variant="outlined"
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      variant="outlined"
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      type="tel"
                      variant="outlined"
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      variant="outlined"
                      required
                      size="small"
                    />
                  </Grid>
                </Grid>

                {/* Create Account Button */}
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    marginTop: '1rem',
                    backgroundColor: '#B88E2F',
                    '&:hover': {
                      backgroundColor: '#A03A06',
                    },
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
                  '&:hover': {
                    borderColor: '#C24507',
                    color: '#C24507',
                  },
                }}
              >
                Sign up with Google
              </Button>

              {/* Already have an account? Log In */}
              <Typography variant="body1" sx={{ color: '#757575' }}>
                Already have an account?{' '}
                <Link
                  component="button" // Use a button instead of an anchor tag
                  sx={{ 
                    color: '#B88E2F', 
                    textDecoration: 'none', 
                    '&:hover': { textDecoration: 'underline' } 
                  }}
                  onClick={() => navigate('/signin')} // Navigate to the Sign In page
                >
                  Log In
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Include the Footer */}
      <Footer />
    </div>
  );
};

export default SignUp;