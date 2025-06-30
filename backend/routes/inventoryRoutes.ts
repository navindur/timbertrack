import express from 'express';
import {
  getAllInventoryController,
  getInventoryByIdController,
  addInventoryController,
  updateInventoryController,
  softDeleteInventoryController,
} from '../controllers/inventoryController';

const router = express.Router();

router.get('/inventory', getAllInventoryController);

router.get('/inventory/:id', getInventoryByIdController);

router.post('/inventory', addInventoryController);

router.put('/inventory/:id', updateInventoryController);

router.delete('/inventory/:id', softDeleteInventoryController);

export default router;
