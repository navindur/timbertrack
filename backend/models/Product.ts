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
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT inventory_id, name, price, quantity, type FROM inventory WHERE is_active = TRUE'
    );
    return rows;
  } catch (error) {
    console.error('Database error in getActiveInventoryItems:', error);
    throw error;
  }
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
// In models/Product.ts
interface ProductFilters {
  page: number;
  limit: number;
  search?: string;
  category?: string;
}

export const getAllActiveProducts = async (
  filters: ProductFilters  // Now accepts a single object
): Promise<RowDataPacket[]> => {
  const { page, limit, search, category } = filters;
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

  try {
    const [rows] = await db.query<RowDataPacket[]>(query, values);
    return rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

// models-product.ts
export const getTotalActiveProducts = async (
  search?: string,
  category?: string
) => {
  let query = `SELECT COUNT(*) as count FROM products p
               JOIN inventory i ON p.inventory_id = i.inventory_id
               WHERE p.is_active = 1`;
  
  const values = [];
  
  if (search) {
    query += ' AND p.name LIKE ?';
    values.push(`%${search}%`);
  }
  
  if (category) {
    query += ' AND i.type = ?';
    values.push(category);
  }
  
  return db.query<RowDataPacket[]>(query, values);
};


// Add to your existing models-product.ts
export const getCustomerProducts = async (
  filters: ProductFilters
): Promise<RowDataPacket[]> => {
  const { page, limit, search, category } = filters;
  const offset = (page - 1) * limit;

  let query = `SELECT 
    p.id,
    p.name,
    p.description,
    p.image_url,
    i.price,
    i.quantity,
    i.type AS category
  FROM products p
  JOIN inventory i ON p.inventory_id = i.inventory_id
  WHERE p.is_active = TRUE AND i.is_active = TRUE`;

  const values: any[] = [];

  if (search) {
    query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
    values.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    query += ' AND i.type = ?';
    values.push(category);
  }

  query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
  values.push(limit, offset);

  const [rows] = await db.query<RowDataPacket[]>(query, values);
  return rows;
};

export const getCustomerProductById = async (id: number): Promise<RowDataPacket | null> => {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT 
      p.*, 
      i.price,
      i.quantity,
      i.type AS category
    FROM products p
    JOIN inventory i ON p.inventory_id = i.inventory_id
    WHERE p.id = ? AND p.is_active = TRUE AND i.is_active = TRUE`,
    [id]
  );
  return rows[0] || null;
};


//new change below
// Add these to your existing Product model

// Get products by category (which is actually inventory.type)
export const getProductsByCategory = async (
  category: string,
  page: number = 1,
  limit: number = 10
): Promise<RowDataPacket[]> => {
  const offset = (page - 1) * limit;
  
  // Debug: Log the received category
  console.log(`[DEBUG] Searching for category: "${category}"`);

  const query = `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.image_url,
      i.price,
      i.quantity,
      i.type AS category
    FROM products p
    JOIN inventory i ON p.inventory_id = i.inventory_id
    WHERE p.is_active = 1 
      AND i.is_active = 1 
      AND i.type LIKE ?
    LIMIT ? OFFSET ?
  `;
  
  // Add wildcards for partial matching
  const categoryParam = `%${category}%`;
  
  console.log(`[DEBUG] Executing query: ${query}`);
  console.log(`[DEBUG] Params:`, [categoryParam, limit, offset]);

  const [rows] = await db.query<RowDataPacket[]>(query, [
    categoryParam,
    limit, 
    offset
  ]);
  
  console.log(`[DEBUG] Found ${rows.length} products`);
  return rows;
};

// Get total count for a category
export const getCategoryProductCount = async (category: string): Promise<number> => {
  const query = `
    SELECT COUNT(*) as count 
    FROM products p
    JOIN inventory i ON p.inventory_id = i.inventory_id
    WHERE p.is_active = 1 
      AND i.is_active = 1 
      AND i.type LIKE ?
  `;
  
  const [rows] = await db.query<RowDataPacket[]>(query, [`%${category}%`]);
  return rows[0].count;
};

// Get available categories
export const getAvailableCategories = async (): Promise<RowDataPacket[]> => {
  const query = `
    SELECT DISTINCT i.type AS category 
    FROM inventory i
    JOIN products p ON i.inventory_id = p.inventory_id
    WHERE i.is_active = TRUE AND p.is_active = TRUE
  `;
  
  const [rows] = await db.query<RowDataPacket[]>(query);
  return rows;
};