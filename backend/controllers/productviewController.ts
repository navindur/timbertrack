import { Request, Response } from 'express';
import * as ProductService from '../services/productviewService';

export const getProductDetails = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await ProductService.getProductDetails(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error in product controller:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
};