//handle db operations for custom orders 
import db from '../db';
import { RowDataPacket } from "mysql2";
import { ResultSetHeader } from 'mysql2';


export interface CustomOrder extends RowDataPacket {
  custom_order_id: number;
  customer_id: number;
  request_date: Date;
  details: string;
  estimated_price: number | null;
  status: 'Pending' | 'Accepted' | 'Rejected';
  updated_at: Date;
  image_url: string | null;
  payment_status: 'unpaid' | 'paid';
  production_status: 'not_started' | 'in_progress' | 'finished' | 'shipped' | 'delivered';
}

export const CustomOrderModel = {
  
  create: async (order: {
    customer_id: number;
    details: string;
    image_url?: string;
  }): Promise<number> => {
    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO custom_orders (customer_id, details, image_url) VALUES (?, ?, ?)",
      [order.customer_id, order.details, order.image_url || null]
    );
    return result.insertId;
  },

  
  findAll: async (): Promise<CustomOrder[]> => {
    const [rows] = await db.query<CustomOrder[]>(
      `SELECT co.*, c.first_name, c.last_name 
       FROM custom_orders co
       JOIN customers c ON co.customer_id = c.customer_id
       ORDER BY co.request_date DESC`
    );
    return rows;
  },

  
  findByCustomerId: async (customerId: number): Promise<CustomOrder[]> => {
    const [rows] = await db.query<CustomOrder[]>(
      `SELECT * FROM custom_orders 
       WHERE customer_id = ?
       ORDER BY request_date DESC`,
      [customerId]
    );
    return rows;
  },

  //find custom order by custom order id
  findById: async (id: number): Promise<CustomOrder | null> => {
    const [rows] = await db.query<CustomOrder[]>(
      `SELECT 
         co.*,
         c.first_name,
         c.last_name,
         c.phone_num,
         c.address_line1,
         c.address_line2,
         c.city,
         c.postal_code
       FROM custom_orders co
       JOIN customers c ON co.customer_id = c.customer_id
       WHERE co.custom_order_id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  acceptOrder: async (id: number, estimatedPrice: number): Promise<boolean> => {
    const [result] = await db.query(
      `UPDATE custom_orders 
       SET status = 'Accepted', estimated_price = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE custom_order_id = ?`,
      [estimatedPrice, id]
    );
    return (result as any).affectedRows > 0;
  },

  
  rejectOrder: async (id: number): Promise<boolean> => {
    const [result] = await db.query(
      `UPDATE custom_orders 
       SET status = 'Rejected', updated_at = CURRENT_TIMESTAMP 
       WHERE custom_order_id = ?`,
      [id]
    );
    return (result as any).affectedRows > 0;
  },

 
  markAsPaid: async (id: number): Promise<boolean> => {
    const [result] = await db.query(
      `UPDATE custom_orders 
       SET payment_status = 'paid', updated_at = CURRENT_TIMESTAMP 
       WHERE custom_order_id = ?`,
      [id]
    );
    return (result as any).affectedRows > 0;
  },

  
  updateProductionStatus: async (
    id: number,
    status: 'not_started' | 'in_progress' | 'finished' | 'shipped' | 'delivered'
  ): Promise<boolean> => {
    const [result] = await db.query(
      `UPDATE custom_orders 
       SET production_status = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE custom_order_id = ?`,
      [status, id]
    );
    return (result as any).affectedRows > 0;
  },
};