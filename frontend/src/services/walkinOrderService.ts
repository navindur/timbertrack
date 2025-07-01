import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/walkin-orders';

//type definition for a walk in order request
export interface WalkinOrderRequest {
    customer: {
      first_name: string;
      last_name: string;
      phone_num: string;
      address_line1?: string;
      address_line2?: string;
      city?: string;
      postal_code?: string;
    };
    items: Array<{
      product_id: number; 
      quantity: number;
      price: number;
    }>;
    paymentMethod: 'cash' | 'card';
    totalAmount: number;
  }

export const createWalkinOrder = async (data: WalkinOrderRequest) => {
  const response = await axios.post(`${API_BASE_URL}`, data);
  return response.data;
};

export const getWalkinReceiptData = async (orderId: number) => {
  const response = await axios.get(`${API_BASE_URL}/${orderId}/receipt`);
  return response.data;
};

export const fetchInventoryItems = async () => {
  const response = await axios.get('http://localhost:5000/api/inventory');
  return response.data;
};

