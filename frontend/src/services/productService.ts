// src/services/productService.ts
import axios from 'axios';

const API_BASE = 'http://localhost:5000/products';

export const getAllProducts = () => axios.get(API_BASE);
export const getProductById = (id: number) => axios.get(`${API_BASE}/${id}`);
export const createProduct = (data: any) => axios.post(API_BASE, data);
export const updateProduct = (id: number, data: any) => axios.put(`${API_BASE}/${id}`, data);
export const deleteProduct = (id: number) => axios.delete(`${API_BASE}/${id}`);
export const addProduct = async (productData: any) => {
    const response = await axios.post('/api/products', productData);
    return response;
  };