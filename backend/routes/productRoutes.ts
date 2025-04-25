import express from 'express';
import multer from 'multer';
import {
  addProduct,
  getInventoryOptions,
  softDeleteProduct,
  updateProduct,
  getAllActiveProducts,
} from '../controllers/productController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Add product with image upload
router.post('/', upload.single('image'), addProduct);

// ✅ Get inventory options for dropdown
router.get('/inventory-options', getInventoryOptions);

// ✅ Soft delete product by ID
router.delete('/:id', softDeleteProduct);

// ✅ Edit product description or image
router.put('/:id', upload.single('image'), updateProduct);

// ✅ Get all active products (with pagination, search, filter)
router.get('/', getAllActiveProducts);

export default router;
