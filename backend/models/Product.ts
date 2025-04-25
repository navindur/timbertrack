import db from '../db';
import { RowDataPacket, OkPacket } from 'mysql2';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  inventory_id: number;
  image_url?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// ✅ Create new product
export const createProduct = async (product: Product) => {
  const [result] = await db.query<OkPacket>(
    `INSERT INTO products (name, description, inventory_id, image_url, is_active)
     VALUES (?, ?, ?, ?, ?)`,
    [
      product.name,
      product.description || null,
      product.inventory_id,
      product.image_url || null,
      product.is_active ?? 1,
    ]
  );
  return result;
};

// ✅ Get all active inventory items
export const getActiveInventoryItems = async (): Promise<RowDataPacket[]> => {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM inventory WHERE is_active = TRUE'
  );
  return rows;
};

// ✅ Soft delete a product
export const softDeleteProduct = async (id: number) => {
  const [result] = await db.query<OkPacket>(
    'UPDATE products SET is_active = 0 WHERE id = ?',
    [id]
  );
  return result;
};

// ✅ Edit product (description and image)
export const updateProduct = async (
  id: number,
  updates: { description?: string; image_url?: string }
) => {
  const fields = [];
  const values = [];

  if (updates.description !== undefined) {
    fields.push('description = ?');
    values.push(updates.description);
  }

  if (updates.image_url !== undefined) {
    fields.push('image_url = ?');
    values.push(updates.image_url);
  }

  if (fields.length === 0) return;

  values.push(id);

  const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
  const [result] = await db.query<OkPacket>(query, values);
  return result;
};

export const getProductById = async (id: number): Promise<RowDataPacket | null> => {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM products WHERE id = ? AND is_active = TRUE',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  };
  

// ✅ Get all active products with search and pagination
interface ProductFilters {
    page: number;
    limit: number;
    search?: string;
    category?: string;
  }
  
  export const getAllActiveProducts = async ({
    page,
    limit,
    search,
    category,
  }: ProductFilters): Promise<RowDataPacket[]> => {
    const offset = (page - 1) * limit;
  
    let query = `SELECT p.*, i.price, i.quantity, i.type AS category 
                 FROM products p
                 JOIN inventory i ON p.inventory_id = i.inventory_id
                 WHERE p.is_active = 1`;
  
    const values: any[] = [];
  
    if (search) {
      query += ' AND p.name LIKE ?';
      values.push(`%${search}%`);
    }
  
    if (category) {
      query += ' AND i.type LIKE ?';
      values.push(`%${category}%`);
    }
  
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);
  
    const [rows] = await db.query<RowDataPacket[]>(query, values);
    return rows;
  };
  