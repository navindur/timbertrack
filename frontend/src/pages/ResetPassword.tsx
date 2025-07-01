//password reset page for users
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import axios from 'axios';
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
//validate password strength
  const validatePassword = (pwd: string) => {
    const lengthValid = pwd.length >= 8;
    const upperValid = /[A-Z]/.test(pwd);
    const lowerValid = /[a-z]/.test(pwd);
    const numberValid = /[0-9]/.test(pwd);
    const specialValid = /[^A-Za-z0-9]/.test(pwd);
    return lengthValid && upperValid && lowerValid && numberValid && specialValid;
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (!validatePassword(password)) {
      setErrorMsg(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      );
      return;
    }
//send reset request to backend
    try {
      const res = await axios.post('/api/auth/reset-password', { token, password });
      setSuccessMsg(res.data.message);
      setTimeout(() => {
  localStorage.removeItem('authToken'); 
  navigate('/signin');
}, 3000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div>
    <Navbar />
    <Box maxWidth={400} mx="auto" mt={8}>
      <Typography variant="h5" gutterBottom>
        Reset Password
      </Typography>
      <form onSubmit={handleReset}>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          required
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          required
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {successMsg && <Alert severity="success" sx={{ mt: 2 }}>{successMsg}</Alert>}
        {errorMsg && <Alert severity="error" sx={{ mt: 2 }}>{errorMsg}</Alert>}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Reset Password
        </Button>
      </form>
    </Box>
    <Footer />
    </div>
  );
};

export default ResetPassword;
