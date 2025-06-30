import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import  db  from '../db'; 

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Authentication required');
    }
// Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET) as { 
      userId: number;
      customerId?: number; 
      role: 'customer' | 'shopowner'; 
    };

    // If user is a customer, confirm that the customer exists in db
    if (decoded.role === 'customer' && decoded.customerId) {
      const [rows]: any = await db.query(
        'SELECT customer_id FROM customers WHERE customer_id = ?', 
        [decoded.customerId]
      );
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid customer. Please register.' });
      }
    }

     // attach decoded user info to request for further use
    (req as any).user = {
      userId: decoded.userId,
      customerId: decoded.customerId,
      role: decoded.role 
    };

    next();// Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Please authenticate' });
  }
};

//restrict access based on user roles
export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !user.role) {
      return res.status(403).json({ error: 'Access denied: No role found' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Access denied: Unauthorized role' });
    }

    next();
  };
};
