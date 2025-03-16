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
            <MuiLink href="#" color="inherit" underline="hover" display="block">
              Home
            </MuiLink>
            <MuiLink href="#" color="inherit" underline="hover" display="block">
              Shop
            </MuiLink>
            <MuiLink href="#" color="inherit" underline="hover" display="block">
              About Us
            </MuiLink>
            <MuiLink href="#" color="inherit" underline="hover" display="block">
              Blog
            </MuiLink>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Customer Service
            </Typography>
            <MuiLink href="#" color="inherit" underline="hover" display="block">
              FAQ
            </MuiLink>
            <MuiLink href="#" color="inherit" underline="hover" display="block">
              Shipping & Returns
            </MuiLink>
            <MuiLink href="#" color="inherit" underline="hover" display="block">
              Privacy Policy
            </MuiLink>
            <MuiLink href="#" color="inherit" underline="hover" display="block">
              Terms & Conditions
            </MuiLink>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Typography variant="body1" gutterBottom>
              123 Furniture Street
            </Typography>
            <Typography variant="body1" gutterBottom>
              City, Country
            </Typography>
            <Typography variant="body1" gutterBottom>
              Email: support@furniture.com
            </Typography>
            <Typography variant="body1" gutterBottom>
              Phone: +123 456 7890
            </Typography>
          </Grid>

          {/* Social Media Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <MuiLink href="#" color="inherit">
                <Facebook fontSize="large" />
              </MuiLink>
              <MuiLink href="#" color="inherit">
                <Twitter fontSize="large" />
              </MuiLink>
              <MuiLink href="#" color="inherit">
                <Instagram fontSize="large" />
              </MuiLink>
              <MuiLink href="#" color="inherit">
                <LinkedIn fontSize="large" />
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
            © {new Date().getFullYear()} Furniture E-Commerce. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;