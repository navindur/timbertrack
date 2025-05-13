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
    const { 
      first_name, 
      last_name, 
      phone_num, 
      address_line1, 
      address_line2, 
      city, 
      postal_code,
      email
    } = req.body;
    
    // Validate email format if provided
    if (email && !CustomerModel.isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Check if email is being updated
    if (email) {
      const currentUser = await CustomerModel.getUserById(userId);
      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Only check for email conflict if email is actually changing
      if (email !== currentUser.email) {
        const emailExists = await CustomerModel.checkEmailExists(email);
        if (emailExists) {
          return res.status(400).json({ 
            message: 'Email already in use by another account',
            errorType: 'EMAIL_CONFLICT' // Optional: add error type for frontend handling
          });
        }
        
        // Update the email in users table
        await CustomerModel.updateUserEmail(userId, email);
      }
    }
    
    // Update the customer profile
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
    
    // Handle specific email conflict error from database
    if (error instanceof Error && error.message.includes('email already exists')) {
      return res.status(400).json({ 
        message: 'Email already in use by another account',
        errorType: 'EMAIL_CONFLICT'
      });
    }
    
    res.status(500).json({ 
      message: 'Error updating customer profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createCustomerProfile = async (req: Request, res: Response) => {
  try {
    const { 
      user_id, 
      first_name, 
      last_name, 
      phone_num, 
      address_line1, 
      address_line2, 
      city, 
      postal_code,
      email 
    } = req.body;
    
    // Verify the user exists
    const existingUser = await CustomerModel.getUserById(user_id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify email matches if provided
    if (email && email !== existingUser.email) {
      return res.status(400).json({ message: 'Email does not match user record' });
    }
    
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