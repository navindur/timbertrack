import axios from 'axios';

const API_BASE_URL = '/api/reports'; 

export const fetchSalesSummary = async (startDate: string, endDate: string) => {
  const response = await axios.get(`${API_BASE_URL}/sales-summary`, {
    params: { start: startDate, end: endDate }
  });
  return response.data;
};

export const fetchSalesByProduct = async (startDate: string, endDate: string) => {
  const response = await axios.get(`${API_BASE_URL}/sales-by-product`, {
    params: { start: startDate, end: endDate }
  });
  return response.data;
};

export const fetchSalesByCategory = async (startDate: string, endDate: string) => {
  const response = await axios.get(`${API_BASE_URL}/sales-by-category`, {
    params: { start: startDate, end: endDate }
  });
  return response.data;
};

export const fetchLowStock = async () => {
  const response = await axios.get(`${API_BASE_URL}/inventory/low-stock`);
  return response.data;
};

export const fetchInventoryValuation = async () => {
  const response = await axios.get(`${API_BASE_URL}/inventory/valuation`);
  return response.data;
};

export const fetchTopCustomers = async (startDate: string, endDate: string) => {
  const response = await axios.get(`${API_BASE_URL}/customers/top`, {
    params: { start: startDate, end: endDate }
  });
  return response.data;
};

export const fetchSalesByPaymentMethod = async (startDate: string, endDate: string) => {
  const response = await axios.get(`${API_BASE_URL}/sales-by-payment`, {
    params: { start: startDate, end: endDate }
  });
  return response.data;
};

export const fetchCustomerOrderHistory = async (customerId: string) => {
  const response = await axios.get(`${API_BASE_URL}/customers/${customerId}/orders`);
  return response.data;
};

export const fetchOrdersByStatus = async (startDate: string, endDate: string) => {
  const response = await axios.get(`${API_BASE_URL}/orders/status`, {
    params: { start: startDate, end: endDate }
  });
  return response.data;
};

export const fetchCustomOrdersByStatus = async (startDate: string, endDate: string) => {
  const response = await axios.get(`${API_BASE_URL}/customorders/status`, {
    params: { start: startDate, end: endDate }
  });
  return response.data;
};

export const fetchOrderDetails = async (orderId: string) => {
  const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
  return response.data;
};