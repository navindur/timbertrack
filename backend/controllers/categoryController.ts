import { Request, Response } from 'express';
import * as CategoryService from '../services/categoryService';

export const handleCategory = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const category = req.params.category.toLowerCase().trim(); // normalize input
    
    console.log(`[CONTROLLER] Processing category: "${category}"`); 
  
    try {
      const result = await CategoryService.getCategoryProducts(
        category,
        Number(page), //Accepts pagination via query params
        Number(limit) //Accepts pagination via query params
      );
      
      console.log(`[CONTROLLER] Result:`, { 
        productsCount: result.products.length,
        total: result.total 
      }); 
      
      res.json(result);// Send back the product data
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

//Shorthand endpoints for fixed category routes
export const getDiningProducts = (req: Request, res: Response) => handleCategory(req, res);
export const getLivingProducts = (req: Request, res: Response) => handleCategory(req, res);
export const getBedroomProducts = (req: Request, res: Response) => handleCategory(req, res);
export const getOfficeProducts = (req: Request, res: Response) => handleCategory(req, res);