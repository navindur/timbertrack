//routes for order managemnet 
import express from 'express';
import OrderController from '../controllers/orderController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticate, OrderController.createOrder as any);
router.get('/history/:customer_id', authenticate, OrderController.getCustomerOrders as any);
router.get('/:order_id', authenticate, OrderController.getOrderDetails as any);

export default router;
