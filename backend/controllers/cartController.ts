//controllers for add to cart functions 
import { Request, Response } from 'express';
import { CartModel } from '../models/cartModel';

export const CartController = {
  async addToCart(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.customerId; 
      const { productId, quantity } = req.body;

      if (!productId || !quantity) {
        return res.status(400).json({ message: 'Product and quantity are required' });
      }

      await CartModel.addToCart(customerId, productId, quantity);
      res.status(201).json({ message: 'Product added to cart' });
    } catch (error) {
      console.error('Add to cart error:', error);
      console.log('Customer from token:', (req as any).user);
      res.status(500).json({ message: 'Error adding to cart' });
    }
  },

  async getCart(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.customerId;
      const cartItems = await CartModel.getCartItems(customerId);
      res.json({ cartItems });
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({ message: 'Error fetching cart' });
    }
  },

  async updateCartItem(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.customerId;
      const { quantity } = req.body;
      const { id } = req.params;

      if (!quantity || !id) {
        return res.status(400).json({ message: 'Quantity and cart item ID are required' });
      }

      await CartModel.updateCartItem(Number(id), quantity, customerId);
      res.json({ message: 'Cart item updated' });
    } catch (error) {
      console.error('Update cart item error:', error);
      res.status(500).json({ message: 'Error updating cart item' });
    }
  },

  async deleteCartItem(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.customerId;
      const { id } = req.params;

      await CartModel.deleteCartItem(Number(id), customerId);
      res.json({ message: 'Cart item deleted' });
    } catch (error) {
      console.error('Delete cart item error:', error);
      res.status(500).json({ message: 'Error deleting cart item' });
    }
  }
};
