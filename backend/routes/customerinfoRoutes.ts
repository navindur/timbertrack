//owner side customer info getting routes 
import { Router } from 'express';
import { 
  getAllCustomers, 
  getCustomerById 
} from '../controllers/customerinfoController';

const router = Router();

router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);

export default router;