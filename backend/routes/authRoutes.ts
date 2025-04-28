// routes/authRoutes.ts
import express from 'express';
import { signup, login } from '../controllers/authController';
import { changePassword } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.put('/auth/change-password',authenticate, changePassword);

export default router;
