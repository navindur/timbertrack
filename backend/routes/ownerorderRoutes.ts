//routes for owner side order management 
import express from 'express';
import {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus
} from '../controllers/ownerorderController';

const router = express.Router();

router.get('/', getAllOrders);
router.get('/:id', getOrderDetails);
router.put('/:id/status', updateOrderStatus);

export default router;