// src/routes/customerProductRoutes.ts
import express from 'express';
import {
  getActiveProducts,
  getProductById
} from '../controllers/productController';

const router = express.Router();

// Get all active products (with search & pagination)
router.get('/', getActiveProducts);

// Get single product details
router.get('/:id', getProductById);

export default router;