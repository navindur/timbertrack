import React from 'react';
import { 
  Box, 
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Button,
  Stack,
  Select,
  MenuItem,
  InputAdornment,
  TextField,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DateRangeIcon from '@mui/icons-material/DateRange';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import SearchHeader from '../components/SearchHeader';
import Navbar from '../components/Adminnavbar';

const ReportsDash = () => {
  // Sample report data
  const reportCards = [
    { 
      title: 'Sales Report', 
      icon: <BarChartIcon color="primary" sx={{ fontSize: 40 }} />,
      description: 'Monthly sales performance and trends',
      action: 'Generate'
    },
    { 
      title: 'Inventory Summary', 
      icon: <AssessmentIcon color="primary" sx={{ fontSize: 40 }} />,
      description: 'Current stock levels and valuation',
      action: 'Generate'
    },
    { 
      title: 'Supplier Performance', 
      icon: <PieChartIcon color="primary" sx={{ fontSize: 40 }} />,
      description: 'Supplier delivery times and quality metrics',
      action: 'Generate'
    },
    { 
      title: 'Customer Orders', 
      icon: <DateRangeIcon color="primary" sx={{ fontSize: 40 }} />,
      description: 'Order history and customer purchasing patterns',
      action: 'Generate'
    }
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      bgcolor: '#efdecd'
    }}>
      {/* Navbar - Fixed width */}
      <Box sx={{ 
        width: 240, 
        flexShrink: 0,
        position: 'fixed',
        height: '100vh'
      }}>
        <Navbar />
      </Box>

      {/* Main Content - Takes remaining space */}
      <Box component="main" sx={{ 
        flexGrow: 1,
        p: 3,
        ml: '240px',
        width: 'calc(100% - 240px)',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}>
        {/* Search Header */}
        <SearchHeader 
          userName="Navindu"
          onSearchChange={(value) => console.log(value)}
        />

        {/* Content Container */}
        <Box sx={{
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          {/* Page Title and Date Range */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Reports Dashboard
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{ width: 150 }}
              />
              <Typography>to</Typography>
              <TextField
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{ width: 150 }}
              />
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                sx={{
                  backgroundColor: '#B88E2F',
                  color: '#fff',
                  borderRadius: '8px',
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#A63A06',
                    boxShadow: 'none'
                  }
                }}
              >
                Export All
              </Button>
            </Stack>
          </Box>

          {/* Quick Filters */}
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                Quick Filters:
              </Typography>
              <Select
                size="small"
                defaultValue="all"
                sx={{ width: 150 }}
              >
                <MenuItem value="all">All Reports</MenuItem>
                <MenuItem value="sales">Sales</MenuItem>
                <MenuItem value="inventory">Inventory</MenuItem>
                <MenuItem value="suppliers">Suppliers</MenuItem>
              </Select>
              <TextField
                size="small"
                placeholder="Search reports..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 300 }}
              />
            </Stack>
          </Paper>

          <Divider sx={{ my: 3 }} />

          {/* Report Cards */}
          <Grid container spacing={3}>
            {reportCards.map((report, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    transition: 'transform 0.3s ease',
                    boxShadow: 3
                  }
                }}>
                  <CardContent sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3
                  }}>
                    <Box sx={{ mb: 2 }}>
                      {report.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {report.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {report.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        borderColor: '#B88E2F',
                        color: '#B88E2F',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          borderColor: '#A63A06'
                        }
                      }}
                    >
                      {report.action}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Reports Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Recent Reports
            </Typography>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Last Generated Reports
                </Typography>
                <Button
                  variant="text"
                  sx={{ color: '#B88E2F' }}
                >
                  View All
                </Button>
              </Box>
              
              {/* Sample report list */}
              <Stack spacing={1}>
                {['Sales Q3 2023', 'Inventory Audit', 'Supplier Performance'].map((report, i) => (
                  <Box key={i} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    p: 1,
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}>
                    <Typography>{report}</Typography>
                    <Button
                      size="small"
                      startIcon={<DownloadIcon fontSize="small" />}
                      sx={{ color: '#6c757d' }}
                    >
                      Download
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportsDash;