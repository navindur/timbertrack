import React from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import Navbar from '../components/Adminnavbar';
import { 
  ArrowUpward,
  ShoppingCartOutlined, // Orders icon
  LocalShippingOutlined, // Delivered icon
  AttachMoneyOutlined // Revenue icon
} from '@mui/icons-material';
import SearchHeader from '../components/SearchHeader';


const Dashboard: React.FC = () => {
  // Stats data with icons
  const stats = [
    { 
      title: 'Total Orders', 
      value: '75', 
      change: '4% (30 days)',
      icon: <ShoppingCartOutlined color="primary" sx={{ fontSize: 24 }} />,
      color: '#F0F7FF'
    },
    { 
      title: 'Total Delivered', 
      value: '12', 
      change: '4% (30 days)',
      icon: <LocalShippingOutlined color="primary" sx={{ fontSize: 24 }} />,
      color: '#F0F7FF'
    },
    { 
      title: 'Total Revenue', 
      value: 'Rs. 24,900', 
      change: '4% (30 days)',
      icon: <AttachMoneyOutlined color="primary" sx={{ fontSize: 24 }} />,
      color: '#F0F7FF'
    }
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: '#efdecd'}}>
      <Navbar />
      
      <Box sx={{ flex: 1, p: 3 }}>
        {/* Search Header */}
        <SearchHeader 
          userName="Navindu"
          onSearchChange={(value) => console.log(value)}
        />

        {/* Welcome Header */}
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }} gutterBottom>
          Welcome back to Timber Track!
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={4} key={stat.title}>
              <Card sx={{ 
                height: '100%',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    {/* Icon Container */}
                    <Box sx={{
                      width: 48,
                      height: 48,
                      bgcolor: stat.color,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      {stat.icon}
                    </Box>
                    
                    {/* Value */}
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  
                  {/* Title */}
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary',
                      mb: 1
                    }}
                  >
                    {stat.title}
                  </Typography>
                  
                  {/* Change indicator */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowUpward sx={{ 
                      color: '#4CAF50', 
                      fontSize: '1rem',
                      mr: 0.5 
                    }}/>
                    <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                      {stat.change}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Total Revenue
                </Typography>
                {/* Placeholder for chart */}
                <Box sx={{ 
                  height: '300px', 
                  bgcolor: '#f5f5f5', 
                  borderRadius: '8px',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Typography color="text.secondary">Chart will go here</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Sales Report
                </Typography>
                {/* Placeholder for chart */}
                <Box sx={{ 
                  height: '300px', 
                  bgcolor: '#f5f5f5',
                  borderRadius: '8px',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Typography color="text.secondary">Chart will go here</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;