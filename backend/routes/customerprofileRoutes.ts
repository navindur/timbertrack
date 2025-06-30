//routes handling operations in costomer profile in customer sidee
import express from 'express';
import { 
  getCustomerProfile, 
  updateCustomerProfile,
  createCustomerProfile 
} from '../controllers/customerprofileController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/:userId', authenticate, getCustomerProfile);

router.put('/:userId', authenticate, updateCustomerProfile);

router.post('/', authenticate, createCustomerProfile);

export default router;