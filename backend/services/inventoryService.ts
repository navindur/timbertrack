import db from '../db'; 

// Service to fetch all active inventory items
export const getAllInventory = async (): Promise<any[]> => {
  const [rows] = await db.query('SELECT * FROM inventory WHERE is_active = TRUE ORDER BY created_at DESC');
  return rows as any[];  // Ensure that we're returning an array (rows)
};



export const addInventory = async (inventoryData: any): Promise<void> => {
  const { name, type, price, quantity, reorder_level, supplier_id } = inventoryData;

  await db.query(
    'INSERT INTO inventory (name, type, price, quantity, reorder_level, supplier_id, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, type, price, quantity, reorder_level, supplier_id, 1] // hardcoded is_active = 1
  );
};


// Service to update an inventory item
export const updateInventory = async (inventoryData: any): Promise<void> => {
  const { inventory_id, name, type, price, quantity, reorder_level, supplier_id, is_active } = inventoryData;
  await db.query(
    'UPDATE inventory SET name = ?, type = ?, price = ?, quantity = ?, reorder_level = ?, supplier_id = ?, is_active = ? WHERE inventory_id = ?',
    [name, type, price, quantity, reorder_level, supplier_id, is_active, inventory_id]
  );
};

// Service to soft delete an inventory item
export const softDeleteInventory = async (inventory_id: number): Promise<void> => {
  await db.query('UPDATE inventory SET is_active = FALSE WHERE inventory_id = ?', [inventory_id]);
};
