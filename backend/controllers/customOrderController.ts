//custom order contoller for customer side and owner side custom order handling 
import { Request, Response } from "express";
import { CustomOrderModel } from "../models/CustomOrder";
import { uploadCustomOrderImageToFirebase } from '../utils/firebase';

export const CustomOrderController = {
 
  createOrder: async (req: Request, res: Response) => {
    try {
      const { customer_id, details } = req.body;
      let imageUrl = null;

      // If theres an image file, upload it to firebase storage firs
      if (req.file) {
        imageUrl = await uploadCustomOrderImageToFirebase(req.file);
      }

      // Create the order in our database
      const orderId = await CustomOrderModel.create({
        customer_id: parseInt(customer_id),
        details,
        image_url: imageUrl ?? undefined,//only add image if we have one
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

  //shopowner dashboard
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

  //get order for customer
  getMyOrders: async (req: Request, res: Response) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const requestingCustomerId = (req as any).user.customerId; 
  
     // Make sure user can only see their own orders
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

  //shopowner accepts an order and sets estimated price
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

 ///shopowner rejects an order 
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

  //after payment from customer mark as paid
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

 //shopowner can update prodcution status
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

   // Gets order receipt with all details for custom order
getOrderReceipt: async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const userId = (req as any).user.id; 
    
    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    // Find the order first
    const order = await CustomOrderModel.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if requestor is shopowner
    const isOwner = order.customer_id === (req as any).user.customerId;
    const isAdmin = (req as any).user.role === 'shopowner' || (req as any).user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized to view this receipt' 
      });
    }

    
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


//give single order by order id 
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


    

   
    const responseData = {
      custom_order_id: order.custom_order_id,
      customer_id: order.customer_id,
      request_date: order.request_date,
      details: order.details,
      estimated_price: order.estimated_price, 
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

