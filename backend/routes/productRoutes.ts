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

router.post('/', upload.single('image'), addProduct);

router.get('/inventory-options', getInventoryOptions);

router.delete('/:id', softDeleteProduct);

router.put('/:id', upload.single('image'), updateProduct);

router.get('/', getAllActiveProducts);

export default router;
