//owner side supplier management routes
import express from 'express';
import {
  getSuppliers,
  createSupplier,
  removeSupplier,
  editSupplier
} from '../controllers/supplierController';

const router = express.Router();

router.get('/', getSuppliers);
router.post('/', createSupplier);
router.delete('/:id', removeSupplier);
router.put('/:id', editSupplier);

export default router;
