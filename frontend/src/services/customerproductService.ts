import { Product, ProductFilters } from '../types/product';

const API_URL = 'http://localhost:5000/api/customer/products';

export const getCustomerProducts = async (
  filters: ProductFilters
): Promise<Product[]> => {
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
  return await response.json();
};


export const getCustomerProductById = async (id: number): Promise<Product> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return await response.json();
};