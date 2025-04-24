import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography 
} from '@mui/material';
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
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { name: 'Products', icon: <ProductsIcon />, path: '/productsdash' },
    { name: 'Inventory', icon: <InventoryIcon />, path: '/inventorylist' },
    { name: 'Orders', icon: <OrdersIcon />, path: '/ordersdash' },
    { name: 'Suppliers', icon: <SuppliersIcon />, path: '/supplierlist' },
    { name: 'Reports', icon: <ReportsIcon />, path: '/reportsdash' },
    { name: 'User Management', icon: <UserManagementIcon />, path: '/usermanagementdash' },
    { name: 'Log out', icon: <LogoutIcon />, path: '/logout' }
  ];

  return (
    <Box sx={{
      width: '240px',
      height: '140vh',
      bgcolor: '#FFFFFF',
      color: '#3E2723',
      p: 2,
    }}>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 2, 
          fontWeight: 'bold', 
          pl: 4,
          cursor: 'pointer'
        }}
        onClick={() => navigate('/dashboard')}
      >
        <span style={{ color: '#C24507' }}>Timber</span>
        <span style={{ color: '#1C486F' }}>Track</span>
      </Typography>
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton 
              onClick={() => navigate(item.path)}
              sx={{ 
                borderRadius: '4px',
                py: 1.8,
                '&:hover': {
                  backgroundColor: '#f0ead6',
                }
              }}
            >
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