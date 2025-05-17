import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

interface CustomerDetails {
  first_name: string;
  last_name: string;
  phone_num: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
}

interface CartItem {
  id: number;
  name: string;
  image_url: string;
  quantity: number;
  product_id: number;
  price: number;
}

interface UserData {
  id: number;
  customerId?: number;
}

interface CreditCardDetails {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const steps = ['Customer Details', 'Payment Method', 'Review Order'];

const CheckoutPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    first_name: '',
    last_name: '',
    phone_num: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [creditCardDetails, setCreditCardDetails] = useState<CreditCardDetails>({
    cardholderName:'',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasCustomerDetails, setHasCustomerDetails] = useState(false);
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [cardValidationErrors, setCardValidationErrors] = useState<{ [key: string]: string }>({});

  const validateCustomerDetails = () => {
    const errors: { [key: string]: string } = {};

    
// Validate first name
if (!customerDetails.first_name.trim()) {
  errors.first_name = 'First name is required';
} else if (customerDetails.first_name.length < 2 || customerDetails.first_name.length > 30) {
  errors.first_name = 'First name must be between 2 and 30 characters';
} else if (!/^[A-Z][a-z]*$/.test(customerDetails.first_name)) {
  errors.first_name = 'First name must contain only letters.';
}

// Validate last name
if (!customerDetails.last_name.trim()) {
  errors.last_name = 'Last name is required';
} else if (customerDetails.last_name.length < 2 || customerDetails.last_name.length > 30) {
  errors.last_name = 'Last name must be between 2 and 30 characters';
} else if (!/^[A-Z][a-z]*$/.test(customerDetails.last_name)) {
  errors.last_name = 'Last name must contain only letters.';
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
  const inputYear = parseInt('20' + yearStr, 10); // Convert YY to 20YY format

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // getMonth is zero-based
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

  const handleCreditCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  let formattedValue = value;

  if (name === 'expiryDate') {
    // Remove non-digit and non-slash characters
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

    const fetchData = async () => {
      try {
        const cartRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let items: CartItem[] = [];
        
        if (cartRes.data?.cartItems && Array.isArray(cartRes.data.cartItems)) {
          items = cartRes.data.cartItems;
        } else if (Array.isArray(cartRes.data)) {
          items = cartRes.data;
        }

        setCartItems(items);

        try {
          const customerId = user?.customerId || user?.id;
          const customerRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/customers/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (customerRes.data) {
            setCustomerDetails({
              first_name: customerRes.data.first_name || '',
              last_name: customerRes.data.last_name || '',
              phone_num: customerRes.data.phone_num || '',
              address_line1: customerRes.data.address_line1 || '',
              address_line2: customerRes.data.address_line2 || '',
              city: customerRes.data.city || '',
              postal_code: customerRes.data.postal_code || '',
            });
            setHasCustomerDetails(true);
          }
        } catch (customerError) {
          console.log('Customer details endpoint not available, using empty form');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleNext = () => {
    if (activeStep === 0 && !validateCustomerDetails()) {
      return;
    }
    if (activeStep === 1 && paymentMethod === 'credit_card' && !validateCreditCardDetails()) {
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
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

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('authToken');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!token || !user?.id) {
      navigate('/signin');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/orders`,
        {
          payment_method: paymentMethod,
          shipping_address: customerDetails,
          ...(paymentMethod === 'credit_card' && {
            card_details: creditCardDetails
          })
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/order-confirmation/${response.data.orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to place order. Please try again.');
      }
    }
  };

  const calculateTotal = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={customerDetails.first_name}
                  onChange={handleCustomerDetailsChange}
                  error={!!validationErrors.first_name}
                  helperText={validationErrors.first_name}
                />
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={customerDetails.last_name}
                  onChange={handleCustomerDetailsChange}
                  error={!!validationErrors.last_name}
                  helperText={validationErrors.last_name}
                />
              </Box>
              <TextField
                required
                fullWidth
                label="Phone Number"
                name="phone_num"
                value={customerDetails.phone_num}
                onChange={handleCustomerDetailsChange}
                error={!!validationErrors.phone_num}
                helperText={validationErrors.phone_num}
              />
              <TextField
                required
                fullWidth
                label="Address Line 1"
                name="address_line1"
                value={customerDetails.address_line1}
                onChange={handleCustomerDetailsChange}
                error={!!validationErrors.address_line1}
                helperText={validationErrors.address_line1}
              />
              <TextField
                fullWidth
                label="Address Line 2"
                name="address_line2"
                value={customerDetails.address_line2 || ''}
                onChange={handleCustomerDetailsChange}
                error={!!validationErrors.address_line2}
                helperText={validationErrors.address_line2}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  name="city"
                  value={customerDetails.city}
                  onChange={handleCustomerDetailsChange}
                  error={!!validationErrors.city}
                  helperText={validationErrors.city}
                />
                <TextField
                  required
                  fullWidth
                  label="Postal Code"
                  name="postal_code"
                  value={customerDetails.postal_code}
                  onChange={handleCustomerDetailsChange}
                  error={!!validationErrors.postal_code}
                  helperText={validationErrors.postal_code}
                />
              </Box>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="payment method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel
                  value="cash_on_delivery"
                  control={<Radio />}
                  label="Cash on Delivery"
                />
                <FormControlLabel
                  value="credit_card"
                  control={<Radio />}
                  label="Credit Card"
                />
              </RadioGroup>
            </FormControl>
            
            {paymentMethod === 'credit_card' && (
              <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Credit Card Details
                </Typography>
                <TextField
                  fullWidth
                  label="Card Holder Name"
                  name="cardholderName"
                  placeholder="Navindu Rasanjana"
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
                <Box sx={{ display: 'flex', gap: 2 }}>
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
                </Box>
              </Box>
            )}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Shipping Address
              </Typography>
              <Typography>
                {customerDetails.first_name} {customerDetails.last_name}
              </Typography>
              <Typography>{customerDetails.address_line1}</Typography>
              {customerDetails.address_line2 && (
                <Typography>{customerDetails.address_line2}</Typography>
              )}
              <Typography>
                {customerDetails.city}, {customerDetails.postal_code}
              </Typography>
              <Typography>Phone: {customerDetails.phone_num}</Typography>
            </Paper>
            
            <Typography variant="subtitle1" gutterBottom>
              Payment Method
            </Typography>
            <Typography sx={{ mb: 2 }}>
              {paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Credit Card'}
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              Order Items
            </Typography>
            <List>
              {cartItems.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemAvatar>
                    <Avatar src={item.image_url} alt={item.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.quantity}`}
                  />
                  <Typography variant="body2">
                    Rs.{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant="h6">
                Total: Rs.{calculateTotal().toFixed(2)}
              </Typography>
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5">Your cart is empty</Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box>
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
            ) : activeStep === 0 ? (
              <Button
                variant="contained"
                onClick={hasCustomerDetails ? handleNext : handleSubmitCustomerDetails}
              >
                {hasCustomerDetails ? 'Next' : 'Save & Continue'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default CheckoutPage;