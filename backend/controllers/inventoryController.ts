//inventory controller 
//some db operations for inventory management also here
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import db from '../db';
import { getAllInventory, addInventory, updateInventory, softDeleteInventory } from '../services/inventoryService';

//to fetch all inventory items
export const getAllInventoryController = async (req: Request, res: Response) => {
  try {
    const inventory = await getAllInventory();
    res.json(inventory);
  } catch (err: unknown) {
    const errorMessage = (err instanceof Error) ? err.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error fetching inventory', error: errorMessage });
  }
};

//to fetch a single inventory item by ID
export const getInventoryByIdController = async (req: Request, res: Response) => {
  const inventory_id = parseInt(req.params.id, 10);
  try {
    const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM inventory WHERE inventory_id = ? AND is_active = TRUE',
        [inventory_id]
      );
      const inventory = rows[0];
      

    if (inventory) {
      res.json(inventory);
    } else {
      res.status(404).json({ message: 'Inventory item not found' });
    }
  } catch (err: unknown) {
    const errorMessage = (err instanceof Error) ? err.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error fetching inventory item', error: errorMessage });
  }
};

//to add a new inventory item
export const addInventoryController = async (req: Request, res: Response) => {
  const { name, type, price, quantity, reorder_level, supplier_id, is_active } = req.body;
  try {
    await addInventory({ name, type, price, quantity, reorder_level, supplier_id, is_active });
    res.status(201).json({ message: 'Inventory item added successfully' });
  } catch (err: unknown) {
    const errorMessage = (err instanceof Error) ? err.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error adding inventory item', error: errorMessage });
  }
};

//to update an inventory item
export const updateInventoryController = async (req: Request, res: Response) => {
  const inventory_id = parseInt(req.params.id, 10);
  const { name, type, price, quantity, reorder_level, supplier_id, is_active } = req.body;
  try {
    
    const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM inventory WHERE inventory_id = ? AND is_active = TRUE',
        [inventory_id]
      );
      const inventory = rows[0];
      

    if (inventory) {
      await updateInventory({ inventory_id, name, type, price, quantity, reorder_level, supplier_id, is_active });
      res.json({ message: 'Inventory item updated successfully' });
    } else {
      res.status(404).json({ message: 'Inventory item not found' });
    }
  } catch (err: unknown) {
    const errorMessage = (err instanceof Error) ? err.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error updating inventory item', error: errorMessage });
  }
};


export const softDeleteInventoryController = async (req: Request, res: Response) => {
  const inventory_id = parseInt(req.params.id, 10);
  try {
    
    const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM inventory WHERE inventory_id = ? AND is_active = TRUE',
        [inventory_id]
      );
      const inventory = rows[0];
      

    if (inventory) {
      await softDeleteInventory(inventory_id);
      res.json({ message: 'Inventory item soft deleted successfully' });
    } else {
      res.status(404).json({ message: 'Inventory item not found' });
    }
  } catch (err: unknown) {
    const errorMessage = (err instanceof Error) ? err.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error soft deleting inventory item', error: errorMessage });
  }
};
