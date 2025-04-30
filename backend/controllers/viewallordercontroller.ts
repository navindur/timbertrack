import { Request, Response } from 'express';
import { OrderModel } from '../models/viewallordermodel';
import { CustomerModel } from '../models/customerModel';
import db from '../db';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    customerId: number;
  };
}

export const OrderController = {
  async getCustomerOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const customerId = req.user?.customerId;
      if (!customerId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const orders = await OrderModel.getOrdersByCustomer(customerId);
      res.json({ success: true, orders });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Failed to fetch orders' 
      });
    }
  },

  async getOrderDetails(req: AuthenticatedRequest, res: Response) {
    try {
      const orderId = parseInt(req.params.order_id);
      const customerId = req.user?.customerId;
      
      if (isNaN(orderId)) {
        return res.status(400).json({ success: false, message: 'Invalid order ID' });
      }

      const order = await OrderModel.getOrderWithDetails(orderId, customerId);
      
      if (!order) {
        return res.status(404).json({ 
          success: false, 
          message: 'Order not found or unauthorized' 
        });
      }

      res.json({ success: true, order });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Failed to fetch order details' 
      });
    }
  },

  async createOrder(req: AuthenticatedRequest, res: Response) {
    const connection = await db.getConnection();
    try {
      const customerId = req.user?.customerId;
      const { payment_method, shipping_address } = req.body;

      if (!customerId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      if (!payment_method) {
        return res.status(400).json({ success: false, message: 'Payment method is required' });
      }

      await connection.query('START TRANSACTION');

      // Get current customer details
      const customer = await CustomerModel.getCustomerById(customerId);
      if (!customer) throw new Error('Customer not found');

      // Update customer address if shipping address is provided
      if (shipping_address) {
        await CustomerModel.updateCustomer(customer.user_id, {
          first_name: shipping_address.first_name || customer.first_name,
          last_name: shipping_address.last_name || customer.last_name,
          phone_num: shipping_address.phone_num || customer.phone_num,
          address_line1: shipping_address.address_line1 || customer.address_line1,
          address_line2: shipping_address.address_line2 || customer.address_line2,
          city: shipping_address.city || customer.city,
          postal_code: shipping_address.postal_code || customer.postal_code,
        });
      }

      // TODO: Replace with actual cart retrieval logic
      const [cartRows] = await connection.query(
        `SELECT ci.product_id, ci.quantity, p.price, p.inventory_id
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.customer_id = ?`,
        [customerId]
      );
      const cartItems = cartRows as any[];

      if (!cartItems.length) {
        throw new Error('Cart is empty');
      }

      const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const [orderResult] = await connection.query(
        `INSERT INTO orders 
         (customer_id, status, total_price, payment_method) 
         VALUES (?, 'pending', ?, ?)`,
        [customerId, totalPrice, payment_method]
      );
      const orderId = (orderResult as any).insertId;

      for (const item of cartItems) {
        await connection.query(
          `INSERT INTO order_items 
           (order_id, product_id, quantity, price) 
           VALUES (?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, item.price]
        );

        await connection.query(
          `UPDATE inventory 
           SET quantity = quantity - ? 
           WHERE inventory_id = ?`,
          [item.quantity, item.inventory_id]
        );
      }

      await connection.query(
        'DELETE FROM cart_items WHERE customer_id = ?',
        [customerId]
      );

      await connection.query('COMMIT');
      connection.release();

      res.status(201).json({ success: true, orderId, totalPrice });

    } catch (error: any) {
      await connection.query('ROLLBACK');
      connection.release();

      res.status(400).json({ 
        success: false, 
        message: error.message || 'Failed to create order' 
      });
    }
  }
};
