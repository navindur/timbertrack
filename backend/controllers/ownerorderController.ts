//owner side order contoll methods 
import { Request, Response } from 'express';
import * as orderService from '../services/ownerorderService';

//fetch all orders 
export const getAllOrders = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      
      const result = await orderService.fetchAllOrders(
        Number(page),
        Number(limit),
        status as string | undefined,
        search as string | undefined
      );
      
      res.status(200).json(result);
    } catch (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  };

  //fetch order detials by id
export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await orderService.fetchOrderDetails(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json(order);
  } catch (err) {
    console.error('Error fetching order details:', err);
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
};

//update order status from owner side
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const success = await orderService.changeOrderStatus(orderId, status);
    
    if (!success) {
      return res.status(404).json({ message: 'Order not found or status not changed' });
    }
    
    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ 
      message: err instanceof Error ? err.message : 'Failed to update order status' 
    });
  }
};