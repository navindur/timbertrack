import express from 'express';
import {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus
} from '../controllers/ownerorderController';

const router = express.Router();

// Get all orders with pagination and filtering
router.get('/', getAllOrders);

// Get specific order details
router.get('/:id', getOrderDetails);

// Update order status
router.put('/:id/status', updateOrderStatus);

export default router;