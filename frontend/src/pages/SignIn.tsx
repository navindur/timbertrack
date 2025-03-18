import React from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Link } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import Footer from '../components/Footer'; // Import Footer from components folder

const SignIn: React.FC = () => {
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

          {/* Right Side: Sign In Form */}
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

              {/* Sign In Form */}
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                Log in to your account
              </Typography>
              <Box component="form" sx={{ width: '100%' }}>
                <Grid container spacing={1}>
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
                      label="Password"
                      type="password"
                      variant="outlined"
                      required
                      size="small"
                    />
                  </Grid>
                </Grid>

                {/* Log In Button */}
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
                  Log In
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

              {/* Sign In with Google */}
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
                Sign in with Google
              </Button>

              {/* Don't have an account? Sign Up */}
              <Typography variant="body1" sx={{ color: '#757575' }}>
                Don't have an account?{' '}
                <Link href="/signup" sx={{ color: '#B88E2F', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  Sign Up
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

export default SignIn;