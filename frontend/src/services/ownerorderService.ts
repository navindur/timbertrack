import axios from 'axios';
import { Order, OrdersResponse, OrderWithDetails } from '../types/ownerorder';

const API_BASE_URL = 'http://localhost:5000/api/ownerorders';

export const fetchOrders = async (
    page: number = 1,
    limit: number = 10,
    status?: string,
    searchTerm?: string
  ): Promise<OrdersResponse> => {
    const response = await axios.get<OrdersResponse>(API_BASE_URL, {
      params: { page, limit, status, search: searchTerm }
    });
    return response.data;
  };
  
export const fetchOrderDetails = async (orderId: number): Promise<OrderWithDetails> => {
  const response = await axios.get<OrderWithDetails>(`${API_BASE_URL}/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (
  orderId: number,
  status: string
): Promise<void> => {
  await axios.put(`${API_BASE_URL}/${orderId}/status`, { status });
  
};