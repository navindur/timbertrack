import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Unauthorized = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        403 - Unauthorized Access
      </Typography>
      <Typography variant="body1" gutterBottom>
        You don't have permission to access this page.
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        Go to Home
      </Button>
    </div>
  );
};