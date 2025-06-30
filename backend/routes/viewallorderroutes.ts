//owder handling routes
import express from 'express';
import { OrderController } from '../controllers/viewallordercontroller';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticate, OrderController.getCustomerOrders);
router.get('/:order_id', authenticate, OrderController.getOrderDetails);
router.post('/', authenticate, OrderController.createOrder);

export default router;