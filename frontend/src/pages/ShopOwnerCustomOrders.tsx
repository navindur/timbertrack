import React, { useEffect, useState } from "react";
import { getAllCustomOrders, acceptCustomOrder, rejectCustomOrder, updateProductionStatus } from "../services/customOrderService";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Chip } from "@mui/material";
import { format } from "date-fns";
import Navbar from '../components/Adminnavbar';
import { useNavigate } from 'react-router-dom';

const ShopOwnerCustomOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [imageModalOpen, setImageModalOpen] = useState(false); //new
  const [selectedImage, setSelectedImage] = useState(''); //new
  const navigate = useNavigate();


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getAllCustomOrders();
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch custom orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleAccept = (order: any) => {
    setSelectedOrder(order);
    setPriceDialogOpen(true);
  };

  const handleReject = async (orderId: number) => {
    try {
      await rejectCustomOrder(orderId);
      setOrders(orders.map(order => 
        order.custom_order_id === orderId ? { ...order, status: 'Rejected' } : order
      ));
    } catch (err) {
      console.error("Failed to reject order:", err);
    }
  };

  const submitAccept = async () => {
    if (!selectedOrder || !estimatedPrice) return;
    
    try {
      await acceptCustomOrder(selectedOrder.custom_order_id, parseFloat(estimatedPrice));
      setOrders(orders.map(order => 
        order.custom_order_id === selectedOrder.custom_order_id 
          ? { ...order, status: 'Accepted', estimated_price: estimatedPrice } 
          : order
      ));
      setPriceDialogOpen(false);
      setEstimatedPrice("");
    } catch (err) {
      console.error("Failed to accept order:", err);
    }
  };

  const openStatusUpdateDialog = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.production_status);
    setStatusUpdateDialogOpen(true);
  };

  const submitStatusUpdate = async () => {
    if (!selectedOrder) return;
    
    try {
      await updateProductionStatus(
        selectedOrder.custom_order_id, 
        newStatus as 'not_started' | 'in_progress' | 'finished' | 'shipped' | 'delivered'
      );
      setOrders(orders.map(order => 
        order.custom_order_id === selectedOrder.custom_order_id 
          ? { ...order, production_status: newStatus } 
          : order
      ));
      setStatusUpdateDialogOpen(false);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

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
    <Box sx={{ 
            flexGrow: 1,
            p: 3,
            ml: 30,
            width: `calc(100% - 240px)`
          }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Custom Order Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/ownerorders')}
        >
          Normal Orders
        </Button>
      </Box>
      
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : orders.length === 0 ? (
        <Typography>No custom orders found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Image</TableCell>
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
                  <TableCell>{order.first_name} {order.last_name}</TableCell>
                  <TableCell>
                    {format(new Date(order.request_date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {order.details}
                  </TableCell>
                  <TableCell>
                    {order.image_url && (
                      <img 
                        src={order.image_url} 
                        alt="Custom order reference" 
                        style={{ 
                          width: 100, 
                          height: 100, 
                          objectFit: 'cover',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setSelectedImage(order.image_url);
                          setImageModalOpen(true);
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      color={
                        order.status === 'Pending' ? 'default' :
                        order.status === 'Accepted' ? 'primary' : 'error'
                      } 
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
                        color={
                          order.production_status === 'not_started' ? 'default' :
                          order.production_status === 'in_progress' ? 'warning' :
                          order.production_status === 'finished' ? 'info' :
                          order.production_status === 'shipped' ? 'primary' : 'success'
                        }
                        onClick={() => order.status === 'Accepted' && openStatusUpdateDialog(order)}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {order.status === 'Pending' && (
                      <>
                        <Button 
                          variant="contained" 
                          color="success" 
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                          onClick={() => handleAccept(order)}
                        >
                          Accept
                        </Button>
                        <Button 
                          variant="contained" 
                          color="error" 
                          size="small"
                          onClick={() => handleReject(order.custom_order_id)}
                        >
                          Reject
                        </Button>
                      </>
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

<Dialog 
        open={imageModalOpen} 
        onClose={() => setImageModalOpen(false)}
        maxWidth="md"
      >
        <DialogTitle>Order Reference Image</DialogTitle>
        <DialogContent>
          <img 
            src={selectedImage} 
            alt="Full size reference" 
            style={{ 
              width: '100%', 
              height: 'auto',
              maxHeight: '80vh',
              objectFit: 'contain'
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>


      {/* Price Dialog */}
      <Dialog open={priceDialogOpen} onClose={() => setPriceDialogOpen(false)}>
        <DialogTitle>Accept Custom Order</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Estimated Price"
            type="number"
            fullWidth
            variant="standard"
            value={estimatedPrice}
            onChange={(e) => setEstimatedPrice(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPriceDialogOpen(false)}>Cancel</Button>
          <Button onClick={submitAccept} disabled={!estimatedPrice}>Accept</Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusUpdateDialogOpen} onClose={() => setStatusUpdateDialogOpen(false)}>
        <DialogTitle>Update Production Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="not_started">Not Started</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="finished">Finished</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusUpdateDialogOpen(false)}>Cancel</Button>
          <Button onClick={submitStatusUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
    </Box>
  );
};

export default ShopOwnerCustomOrders;