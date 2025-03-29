import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  Storage as InventoryIcon,
  LocalShipping as OrdersIcon,
  People as SuppliersIcon,
  Assessment as ReportsIcon,
  People as UserManagementIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

const Navbar: React.FC = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { name: 'Products', icon: <ProductsIcon /> },
    { name: 'Inventory', icon: <InventoryIcon /> },
    { name: 'Orders', icon: <OrdersIcon /> },
    { name: 'Suppliers', icon: <SuppliersIcon /> },
    { name: 'Reports', icon: <ReportsIcon /> },
    { name: 'User Management', icon: <UserManagementIcon /> },
    { name: 'Log out', icon: <LogoutIcon /> }
  ];

  return (
    <Box sx={{
      width: '240px', // Slightly wider to accommodate icons
      height: '140vh',
      bgcolor: '#FFFFFF',
      color: '#3E2723',
      p: 2,
    }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', pl: 4 }}>
        <span style={{ color: '#C24507' }}>Timber</span>
        <span style={{ color: '#1C486F' }}>Track</span>
      </Typography>
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton sx={{ 
              borderRadius: '4px',
              py: 1.8, // Increased vertical padding
              '&:hover': {
                backgroundColor: '#f0ead6',
              }
            }}>
              <ListItemIcon sx={{ color: '#3E2723', minWidth: '40px' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.name} 
                primaryTypographyProps={{ 
                  fontSize: '0.9rem',
                  fontWeight: 'medium'
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Navbar;