import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  InputAdornment, 
  Avatar, 
  IconButton,
  Badge,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

interface SearchHeaderProps {
  userName: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  userAvatar?: string;
  notificationCount?: number;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ 
    userName, 
    searchPlaceholder = "What are you looking for?", 
    onSearchChange,
    userAvatar,
    notificationCount = 0
  }) => {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: '#efdecd',
        mb: 4,
        gap: 3,
        position: 'relative', // Add this
        paddingBottom: '16px' // Add some space for the divider
      }}>
        {/* Content Box */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          gap: 3
        }}>
          {/* Left Side - Greeting with Avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {userAvatar ? (
              <Avatar alt={userName} src={userAvatar} sx={{ width: 40, height: 40 }} />
            ) : (
              <Avatar sx={{ width: 40, height: 40, bgcolor: '#C24507' }}>
                <PersonIcon />
              </Avatar>
            )}
            <Typography variant="h6" sx={{ fontWeight: 'semi-bold', color: 'text.primary' }}>
              Hello, {userName}
            </Typography>
          </Box>
  
          {/* Middle - Search Field */}
          <TextField
            variant="outlined"
            placeholder={searchPlaceholder}
            size="small"
            sx={{
              flex: 1,
              maxWidth: '500px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
                backgroundColor: 'background.paper'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              onSearchChange?.(e.target.value)
            }
          />
  
          {/* Right Side - Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit">
              <Badge 
                badgeContent={notificationCount} 
                color="error"
                max={99}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>
  
        {/* Divider at bottom */}
        <Divider sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderColor: '#3E2723',
          borderBottomWidth: 1,
          
        }} />
      </Box>
    );
  };

export default SearchHeader;