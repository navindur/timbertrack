import db from '../db'; 
import { Supplier } from '../models/supplierModel';

export const getAllSuppliers = async (): Promise<Supplier[]> => {
  const [rows] = await db.query(`
    SELECT * FROM suppliers 
    WHERE is_active = TRUE 
    ORDER BY created_at DESC
  `);
  return rows as Supplier[];
};


export const addSupplier = async (supplier: Supplier): Promise<void> => {
  const { name, contact_person, email, phone, address } = supplier;
  await db.query(
    'INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES (?, ?, ?, ?, ?)',
    [name, contact_person, email, phone, address]
  );
};

export const deleteSupplier = async (id: number): Promise<void> => {
  await db.query('UPDATE suppliers SET is_active = false WHERE id = ?', [id]);
};

export const updateSupplier = async (id: number, supplier: Supplier): Promise<void> => {
  const { name, contact_person, email, phone, address } = supplier;
  await db.query(
    'UPDATE suppliers SET name=?, contact_person=?, email=?, phone=?, address=? WHERE id=?',
    [name, contact_person, email, phone, address, id]
  );
};
