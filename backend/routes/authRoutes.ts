import express from 'express';
import { signup, login } from '../controllers/authController';
import { changePassword } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import db from '../db';

const router = express.Router();

router.post('/auth/signup', signup); //handle user signup
router.post('/auth/login', login); //handles user login
router.put('/auth/change-password',authenticate, changePassword); //handle chnage passowrd
 //hnadle user info fetch
router.get('/auth/me', authenticate, async (req, res) => {
    const user = (req as any).user;
  
    try {
      let customer = null;
      if (user.role === 'customer' && user.customerId) {
        const [rows]: any = await db.query('SELECT * FROM customers WHERE customer_id = ?', [user.customerId]);
        customer = rows[0];
      }
  
      res.json({
        user: {
          userId: user.userId,
          role: user.role,
        },
        customer,
      });
    } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({ error: 'Failed to fetch user info' });
    }
  });
  

export default router;
