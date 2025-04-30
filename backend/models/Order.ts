import db from '../db';
import { CustomerModel } from './customerModel';

export const OrderModel = {
  async createOrder(customerId: number, paymentMethod: string, shippingAddress: any) {
    const connection = await db.getConnection();
    
    try {
      // Start transaction using connection.query
      await connection.query('START TRANSACTION');

      // 1. Get cart items with product and inventory details
      const [cartItems] = await connection.query(
        `SELECT 
           ci.id as cart_item_id,
           ci.quantity,
           p.id as product_id,
           p.inventory_id,
           i.price,
           i.quantity as inventory_quantity
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         JOIN inventory i ON p.inventory_id = i.inventory_id
         WHERE ci.customer_id = ?`,
        [customerId]
      );

      if ((cartItems as any[]).length === 0) {
        throw new Error('Cart is empty');
      }

      // 2. Check inventory levels
      for (const item of cartItems as any[]) {
        if (item.quantity > item.inventory_quantity) {
          throw new Error(`Not enough stock for product ID ${item.product_id}`);
        }
      }

      // 3. Calculate total price
      const totalPrice = (cartItems as any[]).reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );

      // 4. Create the order
      const [orderResult] = await connection.query(
        `INSERT INTO orders 
         (customer_id, status, total_price, payment_method) 
         VALUES (?, 'pending', ?, ?)`,
        [customerId, totalPrice, paymentMethod]
      );

      const orderId = (orderResult as any).insertId;

      // 5. Create order items and update inventory
      for (const item of cartItems as any[]) {
        // Insert order item
        await connection.query(
          `INSERT INTO order_items 
           (order_id, product_id, quantity, price) 
           VALUES (?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, item.price]
        );

        // Update inventory
        await connection.query(
          `UPDATE inventory 
           SET quantity = quantity - ? 
           WHERE inventory_id = ?`,
          [item.quantity, item.inventory_id]
        );
      }

      // 6. Clear the cart
      await connection.query(
        'DELETE FROM cart_items WHERE customer_id = ?',
        [customerId]
      );

      // Commit transaction
      await connection.query('COMMIT');
      connection.release();

      return {
        orderId,
        totalPrice,
        items: cartItems
      };

    } catch (error) {
      // Rollback transaction on error
      await connection.query('ROLLBACK');
      connection.release();
      throw error;
    }
  },

  async getOrderById(orderId: number, customerId?: number) {
    const connection = await db.getConnection();
    try {
      let query = `SELECT 
           o.id, 
           o.customer_id, 
           o.status, 
           o.total_price, 
           o.payment_method, 
           o.created_at,
           c.first_name,
           c.last_name,
           c.phone_num,
           c.address_line1,
           c.address_line2,
           c.city,
           c.postal_code
         FROM orders o
         JOIN customers c ON o.customer_id = c.customer_id
         WHERE o.id = ?`;
      
      const params = [orderId];
      
      if (customerId) {
        query += ' AND o.customer_id = ?';
        params.push(customerId);
      }

      const [order] = await connection.query(query, params);

      if ((order as any[]).length === 0) {
        return null;
      }

      const [items] = await connection.query(
        `SELECT 
           oi.id,
           oi.product_id,
           oi.quantity,
           oi.price,
           p.name,
           p.image_url
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [orderId]
      );

      return {
        ...(order as any[])[0],
        items
      };
    } finally {
      connection.release();
    }
  },

  async getOrdersByCustomer(customerId: number) {
    const connection = await db.getConnection();
    try {
      const [orders] = await connection.query(
        `SELECT 
           o.id, 
           o.status, 
           o.total_price, 
           o.payment_method, 
           o.created_at
         FROM orders o
         WHERE o.customer_id = ?
         ORDER BY o.created_at DESC`,
        [customerId]
      );

      return orders;
    } finally {
      connection.release();
    }
  }
};