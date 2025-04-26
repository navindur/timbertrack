// controllers/categoryController.ts
import { Request, Response } from 'express';
import * as CategoryService from '../services/categoryService';

export const handleCategory = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const category = req.params.category.toLowerCase().trim(); // Normalize input
    
    console.log(`[CONTROLLER] Processing category: "${category}"`); // Debug log
  
    try {
      const result = await CategoryService.getCategoryProducts(
        category,
        Number(page),
        Number(limit)
      );
      
      console.log(`[CONTROLLER] Result:`, { 
        productsCount: result.products.length,
        total: result.total 
      }); // Debug log
      
      res.json(result);
    } catch (error) {
      console.error(`[ERROR] Failed to fetch ${category} products:`, error);
      res.status(500).json({ error: `Failed to fetch ${category} products` });
    }
  };
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getAvailableCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available categories' });
  }
};

export const getDiningProducts = (req: Request, res: Response) => handleCategory(req, res);
export const getLivingProducts = (req: Request, res: Response) => handleCategory(req, res);
export const getBedroomProducts = (req: Request, res: Response) => handleCategory(req, res);