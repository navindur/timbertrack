import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { CustomerModel } from '../models/customerModel';
import { authService as AuthService } from '../services/authService';
 //new

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, first_name, last_name, phone_num = '', address_line1 = '', address_line2 = '', city = '', postal_code = '' } = req.body;

    // Validation
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.createUser({
      email,
      password: hashedPassword,
      role: 'customer'
    });

    await CustomerModel.createCustomer({
    user_id: newUser.id as number, // Type assertion
      first_name,
      last_name,
      phone_num,
      address_line1,
      address_line2,
      city,
      postal_code
    });

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'Signup successful',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Signup failed' });
  }
};

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

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

//new

export const changePassword = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId; // From auth middleware
      const { currentPassword, newPassword } = req.body;
      
      await AuthService.changePassword(userId, currentPassword, newPassword);
      res.json({ message: 'Password changed successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error changing password' });
    }
  };