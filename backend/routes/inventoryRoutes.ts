import express from 'express';
import {
  getAllInventoryController,
  getInventoryByIdController,
  addInventoryController,
  updateInventoryController,
  softDeleteInventoryController,
} from '../controllers/inventoryController';

const router = express.Router();

// Get all inventory items
router.get('/inventory', getAllInventoryController);

// Get a single inventory item by ID
router.get('/inventory/:id', getInventoryByIdController);

// Add new inventory item
router.post('/inventory', addInventoryController);

// Update an inventory item
router.put('/inventory/:id', updateInventoryController);

// Soft delete an inventory item
router.delete('/inventory/:id', softDeleteInventoryController);

export default router;
