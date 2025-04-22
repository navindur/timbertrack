// src/controllers/product.controller.ts
import { Request, Response } from 'express';
import db from '../db';

// Get all products with category and stock info
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const [products] = await db.query(`
      SELECT p.*, c.name AS category_name, i.stock_quantity
      FROM products p
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE p.is_active = TRUE
    `);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products' });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [product] = await db.query(`
      SELECT p.*, c.name AS category_name, i.stock_quantity
      FROM products p
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE p.id = ? AND p.is_active = TRUE
    `, [id]);

    if ((product as any[]).length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json((product as any[])[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching product' });
  }
};

// Create product
export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, category_id, image_url } = req.body;
  try {
    const [result] = await db.query(`
      INSERT INTO products (name, description, price, category_id, image_url)
      VALUES (?, ?, ?, ?, ?)
    `, [name, description, price, category_id, image_url]);

    res.status(201).json({ message: 'Product created', productId: (result as any).insertId });
  } catch (err) {
    res.status(500).json({ error: 'Error creating product' });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, category_id, image_url } = req.body;

  try {
    await db.query(`
      UPDATE products
      SET name = ?, description = ?, price = ?, category_id = ?, image_url = ?
      WHERE id = ?
    `, [name, description, price, category_id, image_url, id]);

    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating product' });
  }
};

// Soft delete product
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.query(`UPDATE products SET is_active = FALSE WHERE id = ?`, [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting product' });
  }
};
