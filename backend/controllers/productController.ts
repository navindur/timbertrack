// src/controllers/productController.ts
import { Request, Response } from 'express';
import pool from '../db';
import { ProductRow } from '../types/database';

export const getRecentProducts = async (req: Request, res: Response) => {
  try {
    // Type assertion for the query result
    const [rows] = await pool.query<ProductRow[]>(`
      SELECT id, name, description, price, category, material 
      FROM products 
      ORDER BY id DESC 
      LIMIT 8
    `);
    
    // The rows will now be properly typed as ProductRow[]
    res.json(rows);
  } catch (error) {
    console.error('Error fetching recent products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};