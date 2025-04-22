// src/routes/products.ts
import { Router } from 'express';
import { getRecentProducts } from '../controllers/productController';

const router = Router();

router.get('/recent', getRecentProducts);

export default router;