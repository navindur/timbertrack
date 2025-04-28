import express from 'express';
import { 
  getCustomerProfile, 
  updateCustomerProfile,
  createCustomerProfile 
} from '../controllers/customerprofileController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Get customer profile
router.get('/:userId', authenticate, getCustomerProfile);

// Update customer profile
router.put('/:userId', authenticate, updateCustomerProfile);

// Create customer profile (used during registration)
router.post('/', authenticate, createCustomerProfile);

export default router;