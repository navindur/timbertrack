import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const Navbar: React.FC = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in by checking localStorage
  const isLoggedIn = Boolean(localStorage.getItem('authToken'));

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/customerprofile');
    } else {
      navigate('/signin');
    }
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: '#efdecd', boxShadow: 'none' }}
      className="text-white"
    >
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" className="text-white no-underline font-bold">
            <span style={{ color: '#C24507' }}>Timber</span>
            <span style={{ color: '#1C486F' }}>Track</span>
          </Link>
        </Typography>

        {/* Navigation Links */}
        <Button
          component={Link}
          to="/"
          sx={{
            backgroundColor: '#efdecd',
            color: '#6b7280',
            '&:hover': { backgroundColor: '#f0ead6' },
            margin: '0 8px',
          }}
        >
          Home
        </Button>
        <Button
          component={Link}
          to="/about-us"
          sx={{
            backgroundColor: '#efdecd',
            color: '#6b7280',
            '&:hover': { backgroundColor: '#f0ead6' },
            margin: '0 8px',
          }}
        >
          About Us
        </Button>

        {/* Cart Icon */}
        <IconButton
          component={Link}
          to="/cart"
          sx={{
            backgroundColor: '#efdecd',
            color: '#6b7280',
            '&:hover': { backgroundColor: '#f0ead6' },
            margin: '0 4px',
          }}
        >
          <ShoppingCartIcon />
        </IconButton>
        
        {/* Profile Icon - Updated to use onClick handler */}
        <IconButton
          onClick={handleProfileClick}
          sx={{
            backgroundColor: '#efdecd',
            color: '#6b7280',
            '&:hover': { backgroundColor: '#f0ead6' },
            margin: '0 4px',
          }}
        >
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;