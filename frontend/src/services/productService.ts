// src/services/productService.ts
import { Product, InventoryOption, ProductFilters } from '../types/product';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

// Get all products with filters (matches getAllProducts import)
export const getAllProducts = async (filters: ProductFilters): Promise<Product[]> => {
  const { page, limit, search, category } = filters;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(category && { category })
  });

  const response = await fetch(`${API_URL}?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  const data = await response.json();
  
  // Handle different response formats
  if (Array.isArray(data)) {
    return data;
  } else if (data?.data && Array.isArray(data.data)) {
    return data.data; // For paginated responses
  } else if (data?.products && Array.isArray(data.products)) {
    return data.data;
  }
  
  console.error('Unexpected API response format:', data);
  return []; // Fallback to empty array
};

// Get product by ID
export const getProductById = async (id: number): Promise<Product> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return await response.json();
};

// Get inventory options
export const getInventoryOptions = async (): Promise<InventoryOption[]> => {
  const response = await fetch(`${API_URL}/inventory-options`);
  if (!response.ok) {
    throw new Error('Failed to fetch inventory options');
  }
  return await response.json();
};

// Add new product (matches addProduct import)
export const addProduct = async (formData: FormData) => {
  return await axios.post('/api/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateProduct = async (id: number, formData: FormData) => {
  return await axios.put(`/api/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
// Delete product (matches deleteProduct import)
export const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
};


