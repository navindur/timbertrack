import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import  db  from '../db'; // Assuming you have a database connection instance

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //const authHeader = req.header('Authorization');
    //console.log("Authorization header:", authHeader);
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { 
      userId: number;
      customerId?: number; // Make optional
      role: 'customer' | 'shopowner'; // Add role
    };

    // For customers, verify customer record exists
    if (decoded.role === 'customer' && decoded.customerId) {
      const [rows]: any = await db.query(
        'SELECT customer_id FROM customers WHERE customer_id = ?', 
        [decoded.customerId]
      );
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid customer. Please register.' });
      }
    }

    // Attach complete user to request
    (req as any).user = {
      userId: decoded.userId,
      customerId: decoded.customerId,
      role: decoded.role // Include role
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Please authenticate' });
  }
};

//new
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
