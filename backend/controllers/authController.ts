import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { CustomerModel } from '../models/customerModel';
import { authService as AuthService } from '../services/authService';


const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey'; // fallback in case env is missing

//Handles user signup (for customers)
export const signup = async (req: Request, res: Response) => {
  try {
    const {
      email, password, first_name, last_name,
      phone_num = '', address_line1 = '', address_line2 = '',
      city = '', postal_code = ''
    } = req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await UserModel.findByEmail(email); // Check for existing user with the same email
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create user record in the User table
    const newUser = await UserModel.createUser({
      email,
      password: hashedPassword,
      role: 'customer'
    });

    //create customer profile with personal details
    await CustomerModel.createCustomer({
      user_id: newUser.id as number,
      
      first_name,
      last_name,
      phone_num,
      address_line1,
      address_line2,
      city,
      postal_code
    });

    //fetch the newly created customer details
    const customer = await CustomerModel.getCustomerByUserId(newUser.id!);

    if (!customer) {
      return res.status(500).json({ message: 'Customer creation failed' });
    }

     //generate JWT token with user and customer info
    const token = jwt.sign(
      {
        userId: newUser.id,
        customerId: customer.customer_id, 
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        customerId: customer.customer_id
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Signup failed' });
  }
};
 //user login handler
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    let customer = null;
    if (user.role === 'customer') {
      customer = await CustomerModel.getCustomerByUserId(user.id!);
      if (!customer) {
        return res.status(403).json({ message: 'Customer profile not found. Please complete registration.' });
      }
    }

      // Create JWT payload
    const tokenPayload: any = {
      userId: user.id,
      role: user.role
    };

    if (customer) {
      tokenPayload.customerId = customer.customer_id;
    }

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        ...(customer && { customerId: customer.customer_id })
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};
 //chnage password handler
export const changePassword = async (req: Request, res: Response) => {
    try {
       // Extract userId from authenticated request
      const userId = (req as any).user.userId; 
      const { currentPassword, newPassword } = req.body;
      
      await AuthService.changePassword(userId, currentPassword, newPassword);
      res.json({ message: 'Password changed successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error changing password' });
    }
  };