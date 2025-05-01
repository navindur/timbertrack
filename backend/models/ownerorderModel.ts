import db from '../db';
import { RowDataPacket, OkPacket } from 'mysql2';

export interface Order {
  id: number;
  customer_id: number;
  created_at: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_price: number;
  payment_method: 'cash_on_delivery' | 'credit_card';
  updated_at: Date;
}

export interface OrderWithDetails extends Order {
  customer_name: string;
  customer_email: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name: string;
  product_image?: string;
}

export const getAllOrders = async (
  page: number = 1,
  limit: number = 10,
  status?: string
): Promise<{ orders: Order[]; total: number }> => {
  const offset = (page - 1) * limit;
  
  let baseQuery = `
    SELECT o.*, 
           CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
           u.email AS customer_email
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN users u ON c.user_id = u.id
  `;
  
  let countQuery = 'SELECT COUNT(*) as total FROM orders o';
  
  const values: any[] = [];
  const countValues: any[] = [];
  
  if (status) {
    baseQuery += ' WHERE o.status = ?';
    values.push(status);
    
    countQuery += ' WHERE o.status = ?';
    countValues.push(status);
  }
  
  baseQuery += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
  values.push(limit, offset);
  
  const [orders] = await db.query<RowDataPacket[]>(baseQuery, values);
  const [totalRows] = await db.query<RowDataPacket[]>(countQuery, countValues);
  
  return {
    orders: orders as Order[],
    total: totalRows[0].total
  };
};

export const getOrderById = async (orderId: number): Promise<OrderWithDetails | null> => {
  // Get order basic info
  const [orderRows] = await db.query<RowDataPacket[]>(`
    SELECT o.*, 
           CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
           u.email AS customer_email,
           c.phone_num AS customer_phone,
           CONCAT(c.address_line1, ' ', COALESCE(c.address_line2, '')) AS customer_address,
           c.city AS customer_city,
           c.postal_code AS customer_postal_code
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN users u ON c.user_id = u.id
    WHERE o.id = ?
  `, [orderId]);

  if (orderRows.length === 0) {
    return null;
  }

  // Get order items
  const [itemRows] = await db.query<RowDataPacket[]>(`
    SELECT oi.*, p.name AS product_name, p.image_url AS product_image
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `, [orderId]);

  return {
    ...(orderRows[0] as OrderWithDetails),
  items: itemRows as OrderItem[]
  };
};

export const updateOrderStatus = async (
  orderId: number,
  newStatus: string
): Promise<boolean> => {
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(newStatus)) {
    throw new Error('Invalid order status');
  }

  const [result] = await db.query<OkPacket>(`
    UPDATE orders 
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [newStatus, orderId]);

  return result.affectedRows > 0;
};