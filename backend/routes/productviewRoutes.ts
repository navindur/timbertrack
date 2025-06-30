//route for customer side product details view 
import express from 'express';
import { getProductDetails } from '../controllers/productviewController';

const router = express.Router();

router.get('/:id', getProductDetails);

export default router;