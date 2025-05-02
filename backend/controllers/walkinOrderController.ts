import { Request, Response } from 'express';
import * as walkinOrderModel from '../models/walkinOrderModel';

export const createWalkinOrder = async (req: Request, res: Response) => {
  try {
    const { customer, items, paymentMethod, totalAmount } = req.body;

    if (!customer || !items || !paymentMethod || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await walkinOrderModel.createWalkinOrder(
      customer,
      items,
      paymentMethod,
      totalAmount
    );

    res.status(201).json({ 
      message: 'Walk-in order created successfully',
      orderId: result.orderId
    });

  } catch (error) {
    console.error('Error creating walk-in order:', error);
    res.status(500).json({ message: 'Failed to create walk-in order' });
  }
};

export const getReceiptData = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    if (isNaN(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const receiptData = await walkinOrderModel.getOrderForReceipt(orderId);
    res.status(200).json(receiptData);

  } catch (error) {
    console.error('Error fetching receipt data:', error);
    res.status(500).json({ message: 'Failed to fetch receipt data' });
  }
};