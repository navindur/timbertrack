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
  CircularProgress,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel
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

interface CreditCardDetails {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}
interface UserData {
  id: number;
  customerId?: number;
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
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [creditCardDetails, setCreditCardDetails] = useState<CreditCardDetails>({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [cardValidationErrors, setCardValidationErrors] = useState<{ [key: string]: string }>({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [hasCustomerDetails, setHasCustomerDetails] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);

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

        const token = localStorage.getItem('authToken');
    const userString = localStorage.getItem('user');
    let user: UserData | null = null;

    try {
      user = userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }

    if (!token || !user?.id) {
      navigate('/signin');
      return;
    }


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
       setHasCustomerDetails(true);
    }
  }, [customer]);

  const validateCustomerDetails = () => {
    const errors: { [key: string]: string } = {};

    // Validate first name
    if (!customerDetails.first_name.trim()) {
      errors.first_name = 'First name is required';
    } else if (customerDetails.first_name.length < 2 || customerDetails.first_name.length > 30) {
      errors.first_name = 'First name must be between 2 and 30 characters';
    } else if (!/^[A-Z][a-z]*$/.test(customerDetails.first_name)) {
      errors.first_name = 'First name must contain only letters';
    }

    // Validate last name
    if (!customerDetails.last_name.trim()) {
      errors.last_name = 'Last name is required';
    } else if (customerDetails.last_name.length < 2 || customerDetails.last_name.length > 30) {
      errors.last_name = 'Last name must be between 2 and 30 characters';
    } else if (!/^[A-Z][a-z]*$/.test(customerDetails.last_name)) {
      errors.last_name = 'Last name must contain only letters';
    }

    // Check if first name and last name are the same
    if (
      customerDetails.first_name.trim().toLowerCase() ===
      customerDetails.last_name.trim().toLowerCase()
    ) {
      errors.first_name = 'First name and last name cannot be the same';
      errors.last_name = 'First name and last name cannot be the same';
    }

    if (!customerDetails.phone_num.trim()) {
      errors.phone_num = 'Phone number is required';
    } else if (!/^0\d{9}$/.test(customerDetails.phone_num.trim())) {
      errors.phone_num = 'Phone number must be 10 digits and start with 0';
    }

    if (!customerDetails.address_line1.trim()) {
      errors.address_line1 = 'Address line 1 is required';
    } else if (
      customerDetails.address_line1.length < 5 || 
      customerDetails.address_line1.length > 100
    ) {
      errors.address_line1 = 'Address line 1 must be 5–100 characters long';
    } else if (!/^[A-Za-z0-9\s,'-.]+$/.test(customerDetails.address_line1)) {
      errors.address_line1 = 'Address line 1 contains invalid characters';
    }

    if (!customerDetails.city.trim()) {
      errors.city = 'City is required';
    } else if (customerDetails.city.length < 2 || customerDetails.city.length > 50) {
      errors.city = 'City must be 2–50 characters long';
    } else if (!/^[A-Za-z\s]+$/.test(customerDetails.city)) {
      errors.city = 'City must contain only letters and spaces';
    }

    if (!customerDetails.postal_code.trim()) {
      errors.postal_code = 'Postal code is required';
    } else if (!/^[0-9]{5}$/.test(customerDetails.postal_code.trim())) {
      errors.postal_code = 'Postal code must be exactly 5 digits';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCreditCardDetails = () => {
    const errors: { [key: string]: string } = {};

    if (!creditCardDetails.cardholderName.trim()) {
      errors.cardholderName = 'Card Holder Name is required';
    } else if (creditCardDetails.cardholderName.trim().length < 2 || creditCardDetails.cardholderName.trim().length > 50) {
      errors.cardholderName = 'Card Holder Name must be between 2 and 50 characters';
    } else if (!/^[A-Za-z\s]+$/.test(creditCardDetails.cardholderName.trim())) {
      errors.cardholderName = 'Card Holder Name must contain only letters and spaces';
    }

    if (!creditCardDetails.cardNumber.trim()) {
      errors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(creditCardDetails.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'Card number must be 16 digits';
    }

    if (!creditCardDetails.expiryDate.trim()) {
      errors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(creditCardDetails.expiryDate.trim())) {
      errors.expiryDate = 'Invalid expiry date (MM/YY)';
    } else {
      const [monthStr, yearStr] = creditCardDetails.expiryDate.split('/');
      const inputMonth = parseInt(monthStr, 10);
      const inputYear = parseInt('20' + yearStr, 10);

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
        errors.expiryDate = 'Card has expired';
      }
    }

    if (!creditCardDetails.cvv.trim()) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(creditCardDetails.cvv.trim())) {
      errors.cvv = 'CVV must be 3 or 4 digits';
    }

    setCardValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

   const handleCustomerDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
  if (name === 'first_name' || name === 'last_name') {
    formattedValue =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
    setCustomerDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  

  const handleCreditCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'expiryDate') {
      formattedValue = value.replace(/[^\d]/g, '');
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
      }
    }

    setCreditCardDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleNext = async () => {
    if (activeStep === 0 && !validateCustomerDetails()) {
      return;
    }
    
    if (activeStep === 1  && !validateCreditCardDetails()) {
      return;
    }

    if (activeStep === 1) {
      try {
        setLoading(true);
        await axiosInstance.put(`/custom-orders/${orderId}/mark-paid`, {
          payment_method: paymentMethod,
          ...(paymentMethod === 'credit_card' && {
            card_details: creditCardDetails
          })
        });
        setPaymentSuccess(true);
        setActiveStep(prev => prev + 1);
      } catch (err) {
        setError('Payment failed. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };



  const handleSubmitCustomerDetails = async () => {
    if (!validateCustomerDetails()) {
      return;
    }

    const token = localStorage.getItem('authToken');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!token || !user?.id) {
      navigate('/signin');
      return;
    }

    try {
      const customerId = user?.customerId || user?.id;
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/customers/${customerId}`,
        customerDetails,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasCustomerDetails(true);
      handleNext();
    } catch (error) {
      console.error('Error updating customer details:', error);
      alert('Failed to update customer details. Please try again.');
    }
  };

  const handlePrintReceipt = () => {
    setShowPrintDialog(true);
    setTimeout(() => {
      window.print();
      setShowPrintDialog(false);
    }, 100);
  };

  // Print-specific styles
  const printStyles = `
    @media print {
      body * {
        visibility: hidden;
      }
      .print-receipt, .print-receipt * {
        visibility: visible;
      }
      .print-receipt {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 20px;
      }
      .no-print {
        display: none !important;
      }
    }
  `;

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
                    error={!!validationErrors.first_name}
                    helperText={validationErrors.first_name}
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
                    error={!!validationErrors.last_name}
                    helperText={validationErrors.last_name}
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
                    error={!!validationErrors.phone_num}
                    helperText={validationErrors.phone_num}
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
                    error={!!validationErrors.address_line1}
                    helperText={validationErrors.address_line1}
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
                    error={!!validationErrors.city}
                    helperText={validationErrors.city}
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
                    error={!!validationErrors.postal_code}
                    helperText={validationErrors.postal_code}
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
                Credit/Debit Card Details
              </Typography>
            <TextField
                    fullWidth
                    label="Card Holder Name"
                    name="cardholderName"
                    value={creditCardDetails.cardholderName}
                    onChange={handleCreditCardChange}
                    error={!!cardValidationErrors.cardholderName}
                    helperText={cardValidationErrors.cardholderName}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Card Number"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={creditCardDetails.cardNumber}
                    onChange={handleCreditCardChange}
                    error={!!cardValidationErrors.cardNumber}
                    helperText={cardValidationErrors.cardNumber}
                    sx={{ mb: 2 }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={creditCardDetails.expiryDate}
                        onChange={handleCreditCardChange}
                        error={!!cardValidationErrors.expiryDate}
                        helperText={cardValidationErrors.expiryDate}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="CVV"
                        name="cvv"
                        placeholder="123"
                        value={creditCardDetails.cvv}
                        onChange={handleCreditCardChange}
                        error={!!cardValidationErrors.cvv}
                        helperText={cardValidationErrors.cvv}
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
                <>
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Payment successful! Your order is now being processed.
                  </Alert>
                  
                  <Paper elevation={2} sx={{ p: 3, mb: 3 }} className={showPrintDialog ? "print-receipt" : ""}>
                     <Typography variant="body1" sx={{ display: 'none', '@media print': { display: 'block', textAlign: 'center', mb: 1 } }}>
                        Jayarani Furniture
                      </Typography>
                                <Typography variant="body1" sx={{ display: 'none', '@media print': { display: 'block', textAlign: 'center', mb: 1 } }}>
                        Galle Road, Kaluthara North
                      </Typography>
                      <Typography variant="body1" sx={{ display: 'none', '@media print': { display: 'block', textAlign: 'center', mb: 1 } }}>
                        Phone: 034 223 7741
                      </Typography>
                    <Typography variant="h6" gutterBottom>
                     Custom Order Receipt
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      Order ID: {order.custom_order_id}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Date: {new Date().toLocaleDateString()}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Customer Information
                    </Typography>
                    <Typography variant="body1">
                      {customerDetails.first_name} {customerDetails.last_name}
                    </Typography>
                    <Typography variant="body1">
                      {customerDetails.address_line1}
                    </Typography>
                    {customerDetails.address_line2 && (
                      <Typography variant="body1">
                        {customerDetails.address_line2}
                      </Typography>
                    )}
                    <Typography variant="body1">
                      {customerDetails.city}, {customerDetails.postal_code}
                    </Typography>
                    <Typography variant="body1">
                      Phone: {customerDetails.phone_num}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Order Details
                    </Typography>
                    <Typography variant="body1">
                      Custom Order
                    </Typography>
                    <Typography variant="body1">
                      Details: {order.details}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1">
                        Total Amount:
                      </Typography>
                      <Typography variant="subtitle1">
                        Rs.{Number(order.estimated_price)?.toFixed(2)}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body1" display="block" sx={{ mt: 2 }}>
                                Thank you for your order!
                              </Typography>
                               <Typography variant="body1" sx={{ display: 'none', '@media print': { display: 'block', textAlign: 'justify', mb: 3 } }}>
                        This receipt also serves as your warranty card. All products are covered under a 2-year warranty from the date of purchase. Please retain this receipt and present it to claim warranty services if needed.
                      </Typography>
                  </Paper>
                  
                  <Box sx={{ display: 'flex', gap: 2 }} className="no-print">
                    <Button
                      variant="contained"
                      onClick={handlePrintReceipt}
                    >
                      Print Receipt
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/my-custom-orders')}
                    >
                      View My Orders
                    </Button>
                  </Box>
                </>
              ) : (
                <Alert severity="error">
                  Payment failed. Please try again.
                </Alert>
              )}
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }} className="no-print">
            {activeStep !== 0 && activeStep !== 2 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            {activeStep === 0 ? (
              <Button
                variant="contained"
                onClick={hasCustomerDetails ? handleNext : handleSubmitCustomerDetails}
                disabled={loading}
              >
                {hasCustomerDetails ? 'Next' : 'Save & Continue'}
              </Button>
            ) : activeStep === 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Pay Now'}
              </Button>
            ) : null}
          </Box>
        </Paper>
      </Box>
      
      {/* Print styles */}
      <style>{printStyles}</style>
      
      <Footer />
    </>
  );
};

export default CustomOrderCheckout;