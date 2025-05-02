import express from 'express';
import {
  createWalkinOrder,
  getReceiptData
} from '../controllers/walkinOrderController';

const router = express.Router();

router.post('/', createWalkinOrder);
router.get('/:id/receipt', getReceiptData);

export default router;