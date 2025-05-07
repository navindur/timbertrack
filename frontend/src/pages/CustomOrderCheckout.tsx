import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
  Grid,
  CircularProgress
} from '@mui/material';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import axios, { AxiosError } from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Customer {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_num: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
}


const steps = ['Customer Details', 'Payment', 'Confirmation'];

const CustomOrderCheckout: React.FC = () => {
  const { orderId } = useParams();
  const { customer } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [customerDetails, setCustomerDetails] = useState({
    phone_num: '',
    first_name: '',
    last_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: ''
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
        try {
            const response = await axiosInstance.get(`/custom-orders/${orderId}`);
            
            console.log('Order data:', response.data);
          
            if (response.data.success) {
              setOrder({
                ...response.data.data,
                estimated_price: response.data.data.estimated_price || 0
              });
            } else {
              setError(response.data.message || 'Order not found');
            }
          } catch (err) {
            const error = err as AxiosError;
            console.error('Error details:', error.response?.data);
            setError(
              (error.response?.data as any)?.message || 'Failed to load order details'
            );
          } finally {
            setLoading(false);
          }
    };
  
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (customer) {
      setCustomerDetails({
        phone_num: customer.phone_num || '',
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        address_line1: customer.address_line1 || '',
        address_line2: customer.address_line2 || '',
        city: customer.city || '',
        postal_code: customer.postal_code || ''
      });
    }
  }, [customer]);

  const handleCustomerDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateCustomerDetails = () => {
    const requiredFields = ['phone_num', 'first_name', 'last_name', 'address_line1', 'city', 'postal_code'];
    return requiredFields.every(field => customerDetails[field as keyof typeof customerDetails]);
  };

  const handleNext = async () => {
    if (activeStep === 0 && !validateCustomerDetails()) {
      setError('Please fill all required fields');
      return;
    }

    if (activeStep === 1) {
      // Process payment (mock implementation)
      try {
        setLoading(true);
        await axiosInstance.put(`/custom-orders/${orderId}/mark-paid`);
        setPaymentSuccess(true);
        setActiveStep(prev => prev + 1);
      } catch (err) {
        setError('Payment failed. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSaveCustomerDetails = async () => {
    try {
      setLoading(true);
      await axiosInstance.put(`/customers/${customer?.customer_id}`, customerDetails);
      handleNext();
    } catch (err) {
      setError('Failed to update customer details');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !order) {
    return <CircularProgress />;
  }

  if (!order) {
    return <Typography>Order not found</Typography>;
  }

  return (
    <>
    <Navbar />
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4 }}>
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={customerDetails.first_name}
                  onChange={handleCustomerDetailsChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={customerDetails.last_name}
                  onChange={handleCustomerDetailsChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone_num"
                  value={customerDetails.phone_num}
                  onChange={handleCustomerDetailsChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 1"
                  name="address_line1"
                  value={customerDetails.address_line1}
                  onChange={handleCustomerDetailsChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 2"
                  name="address_line2"
                  value={customerDetails.address_line2}
                  onChange={handleCustomerDetailsChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={customerDetails.city}
                  onChange={handleCustomerDetailsChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  name="postal_code"
                  value={customerDetails.postal_code}
                  onChange={handleCustomerDetailsChange}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <Typography variant="body1" gutterBottom>
            Order Total: Rs.{Number(order.estimated_price)?.toFixed(2) || '0.00'}
            </Typography>
            
            {/* Mock payment form */}
            <Box sx={{ mt: 3, p: 3, border: '1px solid #eee', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Demo Payment (No real transaction)
              </Typography>
              <TextField
                fullWidth
                label="Card Number"
                placeholder="4242 4242 4242 4242"
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    placeholder="MM/YY"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVC"
                    placeholder="123"
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Order Confirmation
            </Typography>
            {paymentSuccess ? (
              <Alert severity="success" sx={{ mb: 3 }}>
                Payment successful! Your order is now being processed.
              </Alert>
            ) : (
              <Alert severity="error">
                Payment failed. Please try again.
              </Alert>
            )}
            <Typography variant="body1" gutterBottom>
              Order ID: {order.custom_order_id}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Amount Paid: Rs.{order.estimated_price}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          {activeStep === 0 ? (
            <Button
              variant="contained"
              onClick={handleSaveCustomerDetails}
              disabled={!validateCustomerDetails() || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save & Continue'}
            </Button>
          ) : activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => navigate('/my-custom-orders')}
            >
              View My Orders
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Pay Now'}
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
    <Footer />
    </>
  );
};

export default CustomOrderCheckout;