import express from 'express';
import { OrderController } from '../controllers/viewallordercontroller';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Get all orders for authenticated customer
router.get('/', authenticate, OrderController.getCustomerOrders);

// Get specific order details
router.get('/:order_id', authenticate, OrderController.getOrderDetails);

// Create new order
router.post('/', authenticate, OrderController.createOrder);

export default router;