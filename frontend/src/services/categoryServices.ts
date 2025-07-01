import { CategoryResponse, Category } from '../types/Product';

const API_BASE = '/api/categories';

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return await res.json();
};
//fetch products for a specific category with pagination
export const fetchCategoryProducts = async (
  category: string,
  page: number = 1,
  limit: number = 10
): Promise<CategoryResponse> => {
  const res = await fetch(`${API_BASE}/${category}?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch ${category} products`);
  return await res.json();
};

//convenience functions for fetching products by main categories
export const fetchDiningProducts = (page?: number, limit?: number) => 
  fetchCategoryProducts('dining', page, limit);
export const fetchLivingProducts = (page?: number, limit?: number) => 
  fetchCategoryProducts('living', page, limit);
export const fetchBedroomProducts = (page?: number, limit?: number) => 
  fetchCategoryProducts('bedroom', page, limit);
export const fetchOfficeProducts = (page?: number, limit?: number) => 
  fetchCategoryProducts('office', page, limit);