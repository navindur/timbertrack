import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import  db  from '../db'; // Assuming you have a database connection instance

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { 
      userId: number;
      customerId: number;
    };

    // ✅ Check if customer exists in DB
    const [rows]: any = await db.query('SELECT customer_id FROM customers WHERE customer_id = ?', [decoded.customerId]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid customer. Please register.' });
    }

    // Attach user to request
    (req as any).user = {
      userId: decoded.userId,
      customerId: decoded.customerId
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Please authenticate' });
  }
};

