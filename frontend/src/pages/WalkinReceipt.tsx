import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider
} from '@mui/material';
import { Print, ArrowBack } from '@mui/icons-material';
import { getWalkinReceiptData } from '../services/walkinOrderService';

const WalkinReceipt: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadReceiptData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await getWalkinReceiptData(parseInt(id));
        setReceiptData(data);
      } catch (error) {
        console.error('Error loading receipt:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadReceiptData();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <Typography>Loading receipt...</Typography>;
  }

  if (!receiptData) {
    return <Typography>Receipt not found</Typography>;
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to Orders
      </Button>

      <Paper sx={{ p: 3 }} id="receipt-content">
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5">Jayarani Furniture</Typography>
          <Typography>Galle Road, Kaluthara North</Typography>
          <Typography>Phone: 034 223 7741</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Order Receipt</Typography>
          <Typography>Order #: {receiptData.order_id}</Typography>
          <Typography>
            Date: {new Date(receiptData.created_at).toLocaleString()}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Customer Information</Typography>
          <Typography>{receiptData.customer_name}</Typography>
          <Typography>{receiptData.phone_num}</Typography>
          {receiptData.address_line1 && (
            <Typography>{receiptData.address_line1}</Typography>
          )}
          {receiptData.city && receiptData.postal_code && (
            <Typography>
              {receiptData.city}, {receiptData.postal_code}
            </Typography>
          )}
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receiptData.items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell align="right">Rs.{Number(item.price).toFixed(2)}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">Rs.{(parseFloat(item.item_total) || 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <Typography variant="subtitle1">Subtotal</Typography>
                </TableCell>
                <TableCell align="right">
                  Rs.{(parseFloat(receiptData.total_price) || 0).toFixed(2)}

                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <Typography variant="subtitle1">Payment Method</Typography>
                </TableCell>
                <TableCell align="right">
                  
                 {
                      receiptData.payment_method === 'cash'
                      ? 'Cash'
                      : receiptData.payment_method === 'cash_on_delivery'
                      ? 'Cash on Delivery'
                      : 'Card Payment'
                          }
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 3, textAlign: 'justify' }}>
          <Typography>Thank you for your purchase!</Typography>
         <Typography> This receipt also serves as your warranty card. All products are covered under a 2-year warranty from the date of purchase. Please retain this receipt and present it to claim warranty services if needed.
            </Typography>
        </Box>
      </Paper>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<Print />}
          onClick={handlePrint}
        >
          Print Receipt
        </Button>
      </Box>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-content, #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            box-shadow: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </Box>
  );
};

export default WalkinReceipt;