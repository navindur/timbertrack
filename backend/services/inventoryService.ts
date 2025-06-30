//db operations for inventory management
import db from '../db'; 

export const getAllInventory = async (): Promise<any[]> => {
  const [rows] = await db.query('SELECT * FROM inventory WHERE is_active = TRUE ORDER BY created_at DESC');
  return rows as any[];  
};

export const addInventory = async (inventoryData: any): Promise<void> => {
  const { name, type, price, quantity, reorder_level, supplier_id } = inventoryData;

  await db.query(
    'INSERT INTO inventory (name, type, price, quantity, reorder_level, supplier_id, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, type, price, quantity, reorder_level, supplier_id, 1] 
  );
};

export const updateInventory = async (inventoryData: any): Promise<void> => {
  const { inventory_id, name, type, price, quantity, reorder_level, supplier_id, is_active } = inventoryData;
  await db.query(
    'UPDATE inventory SET name = ?, type = ?, price = ?, quantity = ?, reorder_level = ?, supplier_id = ?, is_active = ? WHERE inventory_id = ?',
    [name, type, price, quantity, reorder_level, supplier_id, is_active, inventory_id]
  );
};

export const softDeleteInventory = async (inventory_id: number): Promise<void> => {
  await db.query('UPDATE inventory SET is_active = FALSE WHERE inventory_id = ?', [inventory_id]);
};
