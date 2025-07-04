import { Product, InventoryOption, ProductFilters } from '../types/Product';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

//type for walk in order product
export interface WalkinProduct {
  id: number;
  name: string;
  price: number;
  inventory_quantity: number;
  inventory_id: number;
  image_url?: string;
}

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
  //handle different possible API response formats
  if (Array.isArray(data)) {
    return data;
  } else if (data?.data && Array.isArray(data.data)) {
    return data.data; 
  } else if (data?.products && Array.isArray(data.products)) {
    return data.products;
  }
  
  console.error('Unexpected API response format:', data);
  return []; 
};
export const getAvailableProducts = async (): Promise<WalkinProduct[]> => {
  try {
    const response = await axios.get(`${API_URL}/`);
    
    let productsData = response.data;
   
    if (response.data && response.data.data) {
      productsData = response.data.data;
    }
    else if (response.data && response.data.products) {
      productsData = response.data.products;
    }
    if (!Array.isArray(productsData)) {
      console.error('Expected array but got:', productsData);
      return [];
    }
    
    return productsData.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      inventory_quantity: product.quantity || product.inventory_quantity || 0,
      inventory_id: product.inventory_id,
      image_url: product.image_url,
      description: product.description
    }));
  } catch (error) {
    console.error('Error fetching available products:', error);
    throw new Error('Failed to fetch available products');
  }
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return await response.json();
};

export const getInventoryOptions = async (): Promise<InventoryOption[]> => {
  const response = await fetch(`${API_URL}/inventory-options`);
  if (!response.ok) {
    throw new Error('Failed to fetch inventory options');
  }
  return await response.json();
};

export const addProduct = async (formData: FormData) => {
  return await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateProduct = async (id: number, formData: FormData) => {
  return await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
};