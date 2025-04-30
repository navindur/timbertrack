import { Request, Response } from 'express';
import { OrderModel } from '../models/Order';
import { CustomerModel } from '../models/customerModel';
import db from '../db';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    customerId: number;
  };
}

export const OrderController = {
  async createOrder(req: AuthenticatedRequest, res: Response) {
    const connection = await db.getConnection();
    try {
      const { customerId } = req.user;
      const { payment_method, shipping_address } = req.body;

      // Validate required fields
      if (!payment_method) {
        return res.status(400).json({
          success: false,
          message: 'Payment method is required'
        });
      }

      // Get existing customer details
      const existingCustomer = await CustomerModel.getCustomerById(customerId);
      if (!existingCustomer) {
        return res.status(400).json({
          success: false,
          message: 'Customer profile not found'
        });
      }

      // Update customer details if provided
      if (shipping_address) {
        await connection.query(
          `UPDATE customers 
           SET 
             first_name = ?,
             last_name = ?,
             phone_num = ?,
             address_line1 = ?,
             address_line2 = ?,
             city = ?,
             postal_code = ?
           WHERE customer_id = ?`,
          [
            shipping_address.first_name || existingCustomer.first_name,
            shipping_address.last_name || existingCustomer.last_name,
            shipping_address.phone_num || existingCustomer.phone_num,
            shipping_address.address_line1 || existingCustomer.address_line1,
            shipping_address.address_line2 || existingCustomer.address_line2 || null,
            shipping_address.city || existingCustomer.city,
            shipping_address.postal_code || existingCustomer.postal_code,
            customerId
          ]
        );
      }

      // Create the order
      const order = await OrderModel.createOrder(
        customerId, 
        payment_method, 
        shipping_address || {}
      );

      res.status(201).json({
        success: true,
        orderId: order.orderId,
        totalPrice: order.totalPrice
      });

    } catch (error: any) {
      console.error('Error creating order:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create order'
      });
    } finally {
      connection.release();
    }
  },

  async getOrderDetails(req: AuthenticatedRequest, res: Response) {
    try {
      const { order_id } = req.params;
      const { customerId } = req.user;

      if (!order_id || isNaN(parseInt(order_id))) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order ID'
        });
      }

      const order = await OrderModel.getOrderById(
        parseInt(order_id), 
        customerId
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or unauthorized'
        });
      }

      res.status(200).json({
        success: true,
        order
      });

    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  async getCustomerOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const { customerId } = req.user;
      const orders = await OrderModel.getOrdersByCustomer(customerId);

      res.status(200).json({
        success: true,
        orders
      });

    } catch (error) {
      console.error('Error fetching customer orders:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

export default OrderController;