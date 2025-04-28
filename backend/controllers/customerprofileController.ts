import { Request, Response } from 'express';
import { CustomerModel } from '../models/customerprofileModel';

export const getCustomerProfile = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const customer = await CustomerModel.getByUserId(userId);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    res.status(500).json({ message: 'Error fetching customer profile' });
  }
};

export const updateCustomerProfile = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const { first_name, last_name, phone_num, address_line1, address_line2, city, postal_code } = req.body;
    
    await CustomerModel.update(userId, {
      first_name,
      last_name,
      phone_num,
      address_line1,
      address_line2,
      city,
      postal_code
    });
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating customer profile:', error);
    res.status(500).json({ message: 'Error updating customer profile' });
  }
};

export const createCustomerProfile = async (req: Request, res: Response) => {
  try {
    const { user_id, first_name, last_name, phone_num, address_line1, address_line2, city, postal_code } = req.body;
    
    await CustomerModel.create({
      user_id,
      first_name,
      last_name,
      phone_num,
      address_line1,
      address_line2,
      city,
      postal_code
    });
    
    res.status(201).json({ message: 'Customer profile created successfully' });
  } catch (error) {
    console.error('Error creating customer profile:', error);
    res.status(500).json({ message: 'Error creating customer profile' });
  }
};