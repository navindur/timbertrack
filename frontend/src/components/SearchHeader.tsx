import React from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment, 
  IconButton,
  Badge,
  Divider,
  SxProps,
  Theme
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

interface SearchHeaderProps {
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  notificationCount?: number;
  sx?: SxProps<Theme>;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ 
  searchPlaceholder = "What are you looking for?", 
  onSearchChange,
  notificationCount = 0,
  sx = {}
}) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#efdecd',
      mb: 4,
      position: 'relative',
      ...sx
    }}>
      {/* Main Content */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end', // Changed from 'space-between'
        alignItems: 'center',
        width: '100%',
        gap: 3,
        pb: 2
      }}>
        {/* Search Field - now takes full available space */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder={searchPlaceholder}
          size="small"
          sx={{
            maxWidth: '800px', // Increased max width
            '& .MuiOutlinedInput-root': {
              borderRadius: '50px',
              backgroundColor: 'background.paper',
              pr: 1
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

        {/* Action Icons */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          minWidth: 100,
          justifyContent: 'flex-end'
        }}>
          <IconButton color="inherit" aria-label="notifications">
            <Badge 
              badgeContent={notificationCount} 
              color="error"
              max={99}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton color="inherit" aria-label="settings">
            <SettingsIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Divider */}
      <Divider sx={{
        borderColor: '#3E2723',
        borderBottomWidth: 1
      }} />
    </Box>
  );
};

export default SearchHeader;