import { Request, Response } from "express";
import { CustomOrderModel } from "../models/CustomOrder";
import { uploadCustomOrderImageToFirebase } from '../utils/firebase';

export const CustomOrderController = {
  // Create a new custom order
  createOrder: async (req: Request, res: Response) => {
    try {
      const { customer_id, details } = req.body;
      let imageUrl = null;

      if (req.file) {
        imageUrl = await uploadCustomOrderImageToFirebase(req.file);
      }

      const orderId = await CustomOrderModel.create({
        customer_id: parseInt(customer_id),
        details,
        image_url: imageUrl ?? undefined,
      });

      res.status(201).json({ 
        success: true, 
        orderId,
        message: "Custom order created successfully" 
      });
    } catch (error) {
      console.error("Error creating custom order:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to create custom order" 
      });
    }
  },

  // Get all custom orders (for shop owner)
  getAllOrders: async (req: Request, res: Response) => {
    try {
      const orders = await CustomOrderModel.findAll();
      res.status(200).json({ 
        success: true, 
        data: orders 
      });
    } catch (error) {
      console.error("Error fetching custom orders:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch custom orders" 
      });
    }
  },

  // Get orders for a specific customer
  getMyOrders: async (req: Request, res: Response) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const requestingCustomerId = (req as any).user.customerId; // From auth middleware
  
      // Verify the requesting user matches the customerId
      if (customerId !== requestingCustomerId) {
        return res.status(403).json({ 
          success: false, 
          message: 'Unauthorized to view these orders' 
        });
      }
  
      const orders = await CustomOrderModel.findByCustomerId(customerId);
      res.status(200).json({ 
        success: true, 
        data: orders 
      });
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch your orders" 
      });
    }
  },

  // Accept a custom order
  acceptOrder: async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);
      const { estimated_price } = req.body;

      const success = await CustomOrderModel.acceptOrder(orderId, estimated_price);
      if (success) {
        res.status(200).json({ 
          success: true, 
          message: "Order accepted successfully" 
        });
      } else {
        res.status(404).json({ 
          success: false, 
          message: "Order not found" 
        });
      }
    } catch (error) {
      console.error("Error accepting order:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to accept order" 
      });
    }
  },

  // Reject a custom order
  rejectOrder: async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);
      const success = await CustomOrderModel.rejectOrder(orderId);
      if (success) {
        res.status(200).json({ 
          success: true, 
          message: "Order rejected successfully" 
        });
      } else {
        res.status(404).json({ 
          success: false, 
          message: "Order not found" 
        });
      }
    } catch (error) {
      console.error("Error rejecting order:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to reject order" 
      });
    }
  },

  // Mark order as paid
  markAsPaid: async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);
      const success = await CustomOrderModel.markAsPaid(orderId);
      if (success) {
        res.status(200).json({ 
          success: true, 
          message: "Order marked as paid successfully" 
        });
      } else {
        res.status(404).json({ 
          success: false, 
          message: "Order not found" 
        });
      }
    } catch (error) {
      console.error("Error marking order as paid:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to mark order as paid" 
      });
    }
  },

  // Update production status
  updateProductionStatus: async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;

      const success = await CustomOrderModel.updateProductionStatus(orderId, status);
      if (success) {
        res.status(200).json({ 
          success: true, 
          message: "Order status updated successfully" 
        });
      } else {
        res.status(404).json({ 
          success: false, 
          message: "Order not found" 
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to update order status" 
      });
    }
  },

getOrderReceipt: async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const userId = (req as any).user.id; // From auth middleware
    
    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    // Get the order with customer details
    const order = await CustomOrderModel.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Verify the requesting user owns the order or is admin/shopowner
    const isOwner = order.customer_id === (req as any).user.customerId;
    const isAdmin = (req as any).user.role === 'shopowner' || (req as any).user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized to view this receipt' 
      });
    }

    // Format the response
    const responseData = {
      success: true,
      data: {
        custom_order_id: order.custom_order_id,
        request_date: order.request_date,
        details: order.details,
        estimated_price: order.estimated_price,
        status: order.status,
        payment_status: order.payment_status,
        customer: {
          first_name: order.first_name,
          last_name: order.last_name,
          phone_num: order.phone_num,
          address_line1: order.address_line1,
          address_line2: order.address_line2,
          city: order.city,
          postal_code: order.postal_code
        }
      }
    };

    res.status(200).json(responseData);
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching order receipt:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch order receipt',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
},


// Add this to your CustomOrderController
getOrderById: async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    
    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    const order = await CustomOrderModel.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }


    

    // Ensure the response includes all required fields
    const responseData = {
      custom_order_id: order.custom_order_id,
      customer_id: order.customer_id,
      request_date: order.request_date,
      details: order.details,
      estimated_price: order.estimated_price, // This is critical
      status: order.status,
      image_url: order.image_url,
      payment_status: order.payment_status,
      production_status: order.production_status,
      customer: {
        first_name: order.first_name,
        last_name: order.last_name,
        phone_num: order.phone_num,
        address_line1: order.address_line1,
        address_line2: order.address_line2,
        city: order.city,
        postal_code: order.postal_code
      }
    };

    res.status(200).json({ 
      success: true, 
      data: responseData 
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching order:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch order',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
},



};

