import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#2C2C2C', // Dark background
        color: '#FFFFFF', // White text
        padding: '4rem 0',
        marginTop: '4rem',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <MuiLink href="/" color="inherit" underline="hover" display="block">
              Home
            </MuiLink>
            <MuiLink href="/products" color="inherit" underline="hover" display="block">
              Shop
            </MuiLink>
            <MuiLink href="/about-us" color="inherit" underline="hover" display="block">
              About Us
            </MuiLink>
           
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Services
            </Typography>
            <MuiLink href="/cart" color="inherit" underline="hover" display="block">
            Cart
            </MuiLink>
            <MuiLink href="/my-custom-orders" color="inherit" underline="hover" display="block">
            Custom Orders
            </MuiLink>
            <MuiLink href="/customerprofile" color="inherit" underline="hover" display="block">
            Profile
            </MuiLink>
            
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Typography variant="body1" gutterBottom>
              Jayarani Furniture
            </Typography>
            <Typography variant="body1" gutterBottom>
              Galle Road, Kaluthara North
            </Typography>
            <Typography variant="body1" gutterBottom>
              Email: timbertrack@gmail.com
            </Typography>
            <Typography variant="body1" gutterBottom>
              Phone: 034 223 7741
            </Typography>
          </Grid>

          {/* Social Media Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <MuiLink href="http://facebook.com/" color="inherit">
                <Facebook fontSize="large" />
              </MuiLink>
              
              <MuiLink href="http://instagram.com/" color="inherit">
                <Instagram fontSize="large" />
              </MuiLink>
             
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: '1px solid #444',
            paddingTop: '2rem',
            marginTop: '2rem',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} TimberTrack. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;