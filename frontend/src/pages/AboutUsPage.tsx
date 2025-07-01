import React from 'react';
import { Box, Typography, Container, Button, Grid } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutUsPage = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}> 
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" gutterBottom>
            About Us
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Welcome to TimberTrack - Your Trusted Furniture Partner
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center' }}>
              <img 
                src="/logo.png" 
                alt="Furniture Showroom" 
                style={{ 
                    maxWidth: '100%',  
                    maxHeight: '240px', 
                    borderRadius: '8px',
                    marginLeft: '100px' 
                  }} 
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              At TimberTrack, our mission is to provide high-quality furniture while ensuring the best customer experience in the industry. We believe in making every home and office space beautiful and functional with our stylish, handcrafted furniture.
            </Typography>
            <Typography variant="body1" paragraph>
              With a variety of customizable options, we cater to the needs of both individual customers and businesses, ensuring that every piece is crafted to perfection.
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Why Choose Us?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary">
                Quality Craftsmanship
              </Typography>
              <Typography variant="body2">
                Each piece of furniture is carefully crafted with attention to detail, ensuring durability and elegance.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary">
                Affordable Prices
              </Typography>
              <Typography variant="body2">
                We offer competitive prices, making quality furniture accessible to everyone.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary">
                Exceptional Customer Service
              </Typography>
              <Typography variant="body2">
                Our dedicated team is always here to help you find the perfect furniture to suit your style and budget.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default AboutUsPage;
