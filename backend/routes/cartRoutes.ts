import { Router } from 'express';
import { CartController } from '../controllers/cartController';
import { authenticate } from '../middleware/authMiddleware'; // Use your auth middleware

const router = Router();

router.post('/add', authenticate, CartController.addToCart);
router.get('/', authenticate, CartController.getCart);
router.put('/update/:id', authenticate, CartController.updateCartItem);
router.delete('/delete/:id', authenticate, CartController.deleteCartItem);

export default router;
