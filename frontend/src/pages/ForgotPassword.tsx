//forget password for all
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import axios from 'axios';
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setSuccessMsg(res.data.message);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
     <div>
    <Navbar />
    <Box maxWidth={400} mx="auto" mt={8}>
      <Typography variant="h5" gutterBottom>
        Forgot Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {successMsg && <Alert severity="success">{successMsg}</Alert>}
        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Send Reset Link
        </Button>
      </form>
    </Box>
    <Footer />
    </div>
  );
};

export default ForgotPassword;
