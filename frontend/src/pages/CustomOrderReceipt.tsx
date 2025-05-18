import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface CustomOrder {
  custom_order_id: number;
  customer_id: number;
  details: string;
  estimated_price: number;
  status: string;
  request_date: string;
  payment_status: string;
  customer: {
    first_name: string;
    last_name: string;
    phone_num: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    postal_code: string;
  };
}

const CustomOrderReceipt: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<CustomOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get(`/custom-orders/${orderId}/receipt`);
        
        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          setError(response.data.message || 'Order not found');
        }
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePrintReceipt = () => {
    setShowPrintDialog(true);
    setTimeout(() => {
      window.print();
      setShowPrintDialog(false);
    }, 100);
  };

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

  if (loading) {
    return <CircularProgress />;
  }

  if (!order) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Order not found'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/my-custom-orders')}>
          Back to My Orders
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      
        
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
          <Typography variant="h5" gutterBottom>
            Custom Order Receipt
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Order ID: {order.custom_order_id}
          </Typography>
          <Typography variant="body1" gutterBottom>
           Date: {order.request_date ? new Date(order.request_date).toLocaleDateString() : 'N/A'}

          </Typography>
          <Typography variant="body1" gutterBottom>
            Status: {order.status}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Payment: {order.payment_status}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Customer Information
          </Typography>
          <Typography variant="body1">
            {order.customer.first_name} {order.customer.last_name}
          </Typography>
          <Typography variant="body1">
            {order.customer.address_line1}
          </Typography>
          {order.customer.address_line2 && (
            <Typography variant="body1">
              {order.customer.address_line2}
            </Typography>
          )}
          <Typography variant="body1">
            {order.customer.city}, {order.customer.postal_code}
          </Typography>
          <Typography variant="body1">
            Phone: {order.customer.phone_num}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Order Details
          </Typography>
          <Typography variant="body1">
            Custom Order
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {order.details}
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
            Back to My Orders
          </Button>
        </Box>
      </Box>
      
      <style>{printStyles}</style>
      <Footer />
    </>
  );
};

export default CustomOrderReceipt;