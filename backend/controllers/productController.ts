import { Request, Response } from 'express';
import * as productService from '../services/productService';

export const addProduct = async (req: Request, res: Response) => {
  try {
    const result = await productService.addProduct(req.body, req.file);
    res.status(201).json({ message: 'Product added successfully.', result });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getInventoryOptions = async (req: Request, res: Response) => {
  try {
    const inventory = await productService.fetchInventoryOptions();
    res.status(200).json(inventory);
  } catch (err: any) {
    console.error('Controller error in getInventoryOptions:', err);
    res.status(500).json({ 
      message: 'Failed to fetch inventory list',
      error: err.message 
    });
  }
};

// ✅ Soft Delete Product
export const softDeleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    await productService.softDeleteProduct(productId);
    res.status(200).json({ message: 'Product soft-deleted successfully.' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Edit Product (description & image)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const result = await productService.updateProduct(productId, req.body, req.file);
    res.status(200).json({ message: 'Product updated successfully.', result });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Get All Active Products (with search & pagination)
export const getAllActiveProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;
    
    const result = await productService.getAllActiveProducts(
      Number(page),
      Number(limit),
      search as string,
      category as string
    );
    
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Add these to your existing productController.ts
export const getActiveProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;
    
    const result = await productService.getCustomerProducts(
      Number(page),
      Number(limit),
      search as string,
      category as string
    );
    
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await productService.getCustomerProductById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};