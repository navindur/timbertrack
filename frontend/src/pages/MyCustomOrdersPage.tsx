import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyCustomOrders } from "../services/customOrderService";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button, Chip } from "@mui/material";
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const statusColors: Record<'Pending' | 'Accepted' | 'Rejected', "default" | "info" | "error"> = {
    Pending: "default",
    Accepted: "info",
    Rejected: "error",
  };

  const productionStatusColors: Record<'not_started' | 'in_progress' | 'finished' | 'shipped' | 'delivered', 
  "default" | "warning" | "info" | "primary" | "success"> = {
  not_started: "default",
  in_progress: "warning",
  finished: "info",
  shipped: "primary",
  delivered: "success",
};

const MyCustomOrdersPage: React.FC = () => {
  const { customer } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customer) {
        setOrders([]); 
        return;
      }
      
      try {
        setLoading(true);
        const response = await getMyCustomOrders(customer.customer_id);
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch your orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customer]);

  const handlePayNow = (orderId: number) => {
    navigate(`/custom-order-checkout/${orderId}`);
  };

  return (
    <>
    <Navbar />
    
    <Box sx={{ p: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
  <Typography variant="h4">
    My Custom Orders
  </Typography>
  <Button variant="contained" color="primary" onClick={() => navigate('/custom-order')}>
    + New Custom Order
  </Button>
</Box>

      
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : orders.length === 0 ? (
        <Typography>You have no custom orders yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Production</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>Receipts</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.custom_order_id}>
                  <TableCell>{order.custom_order_id}</TableCell>
                  <TableCell>
                    {format(new Date(order.request_date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {order.details}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      color={statusColors[order.status as keyof typeof statusColors]} 
                    />
                  </TableCell>
                  <TableCell>
                    {order.estimated_price ? `Rs.${order.estimated_price}` : "-"}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.payment_status} 
                      color={order.payment_status === 'paid' ? 'success' : 'default'} 
                    />
                  </TableCell>
                  <TableCell>
                    {order.status === 'Accepted' && (
                      <Chip 
                        label={order.production_status.replace('_', ' ')} 
                        color={productionStatusColors[order.production_status as keyof typeof productionStatusColors]} 
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {order.status === 'Accepted' && order.payment_status === 'unpaid' && (
                      <Button 
                        variant="contained" 
                        size="small"
                        onClick={() => handlePayNow(order.custom_order_id)}
                      >
                        Pay Now
                      </Button>
                    )}
                  </TableCell>
                   <TableCell>
                    <Button
                              variant="outlined"
                              size="small"
                              onClick={() => navigate(`/custom-orders/${order.custom_order_id}/receipt`)}
                              >
                              View
                      </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
    <Footer />
    </>
  );
};

export default MyCustomOrdersPage;