import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, InputBase } from '@mui/material';
import { Link } from 'react-router-dom';
//import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar: React.FC = () => {
  return (
    // Change the background color to `bg-custom-brown` and text color to `text-white`
    <AppBar
  position="static"
  sx={{ backgroundColor: '#efdecd', boxShadow: 'none' }} // Override background color and shadow
  className="text-white" // Use Tailwind for text color
>
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* Change text color to `text-white` for better contrast */}
          <Link to="/" className="text-white no-underline font-bold">
              <span style={{ color: '#C24507' }}>Timber</span>
               <span style={{ color: '#1C486F' }}>Track</span>
          </Link>
        </Typography>

        {/* Search Bar */}
        {/* No changes needed here */}
         {/*<div className="flex items-center bg-gray-100 rounded-lg px-2 py-1 mx-4">
          <SearchIcon className="text-gray-500" />
          <InputBase
            placeholder="Search Products"
            className="ml-2"
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>*/}

        {/* Navigation Links */}
        {/* Change text color to `text-white` for better contrast */}
        <Button
  component={Link}
  to="/"
  sx={{
    backgroundColor: '#efdecd', // Background color
    color: '#6b7280', // Text color
    '&:hover': {
      backgroundColor: '#f0ead6', // Darker shade on hover
    },
    margin: '0 8px', // Add some spacing between buttons
  }}
>
  Home
</Button>
<Button
  component={Link}
  to="/products"
  sx={{
    backgroundColor: '#efdecd', // Background color
    color: '#6b7280', // Text color
    '&:hover': {
      backgroundColor: '#f0ead6', // Darker shade on hover
    },
    margin: '0 8px', // Add some spacing between buttons
  }}
>
  About Us
</Button>

        {/* Cart Icon */}
        {/* Change text color to `text-white` for better contrast */}
        <IconButton
  component={Link}
  to="/cart"
  sx={{
    backgroundColor: '#efdecd', // Background color
    color: '#6b7280', // Icon color
    '&:hover': {
      backgroundColor: '#f0ead6', // Darker shade on hover
    },
    margin: '0 4px', // Add some spacing between buttons
  }}
>
  <ShoppingCartIcon />
</IconButton>
<IconButton
  component={Link}
  to="/customerprofile"
  sx={{
    backgroundColor: '#efdecd', // Background color
    color: '#6b7280', // Icon color
    '&:hover': {
      backgroundColor: '#f0ead6', // Darker shade on hover
    },
    margin: '0 4px', // Add some spacing between buttons
  }}
>
  <AccountCircleIcon />
</IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;