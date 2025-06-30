//controller for receive customer info for owner side
import { Request, Response } from 'express';
import * as CustomerService from '../services/customerinfoService';

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const customers = await CustomerService.getCustomers(
      Number(page),
      Number(limit),
      String(search)
    );
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message }); //handle unexpected errors

  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await CustomerService.getCustomerById(Number(req.params.id));
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    // return the customer data
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });

  }
};