import db from '../db';
import { RowDataPacket, OkPacket } from 'mysql2';

export interface WalkinOrder {
  order_id: number;
  customer_id: number;
  total_amount: number;
  payment_method: 'cash' | 'card';
  created_at: Date;
}

export interface WalkinOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export const createWalkinOrder = async (
    customerData: {
      first_name: string;
      last_name: string;
      phone_num: string;
      address_line1?: string;
      address_line2?: string;
      city?: string;
      postal_code?: string;
    },
    items: Array<{
      product_id: number;
      quantity: number;
      price: number;
    }>,
    paymentMethod: 'cash' | 'card',
    totalAmount: number
  ): Promise<{ orderId: number }> => {
    await db.query('START TRANSACTION');
  
    try {
      // 1. Create customer record
      const [userResult] = await db.query<OkPacket>(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [`walkin-${Date.now()}@example.com`, 'temp-password', 'customer']
      );
  
      const userId = userResult.insertId;
  
      const [customerResult] = await db.query<OkPacket>(
        `INSERT INTO customers 
         (user_id, first_name, last_name, phone_num, address_line1, address_line2, city, postal_code)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          customerData.first_name,
          customerData.last_name,
          customerData.phone_num,
          customerData.address_line1 || null,
          customerData.address_line2 || null,
          customerData.city || null,
          customerData.postal_code || null
        ]
      );
  
      const customerId = customerResult.insertId;
  
      // 2. Create order record
      const [orderResult] = await db.query<OkPacket>(
        `INSERT INTO orders 
         (customer_id, status, total_price, payment_method)
         VALUES (?, ?, ?, ?)`,
        [
          customerId,
          'pending',
          totalAmount,
          paymentMethod === 'cash' ? 'cash' : 'credit_card'
        ]
      );
  
      const orderId = orderResult.insertId;
  
      // 3. Create order items and update inventory
      for (const item of items) {
        // Verify product exists and get inventory_id
        const [productRows] = await db.query<RowDataPacket[]>(
          'SELECT inventory_id FROM products WHERE id = ?',
          [item.product_id]
        );
        
        if (productRows.length === 0) {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }
  
        const inventoryId = productRows[0].inventory_id;
  
        // Add order item
        await db.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );
  
        // Update inventory quantity
        await db.query(
          'UPDATE inventory SET quantity = quantity - ? WHERE inventory_id = ? AND quantity >= ?',
          [item.quantity, inventoryId, item.quantity]
        );
      }
  
      await db.query('COMMIT');
      return { orderId };
  
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  };

export const getOrderForReceipt = async (orderId: number): Promise<any> => {
  const [orderRows] = await db.query<RowDataPacket[]>(`
    SELECT 
      o.id as order_id, 
      o.total_price, 
      o.payment_method,
      o.created_at,
      CONCAT(c.first_name, ' ', c.last_name) as customer_name,
      c.phone_num,
      c.address_line1,
      c.address_line2,
      c.city,
      c.postal_code
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    WHERE o.id = ?
  `, [orderId]);

  if (orderRows.length === 0) {
    throw new Error('Order not found');
  }

  const [itemRows] = await db.query<RowDataPacket[]>(`
    SELECT 
      oi.id,
      oi.product_id,
      p.name as product_name,
      p.image_url as product_image,
      oi.quantity,
      oi.price,
      (oi.quantity * oi.price) as item_total
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `, [orderId]);

  return {
    ...orderRows[0],
    items: itemRows
  };
};