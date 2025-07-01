import axios from 'axios';

const API_URL = 'http://localhost:5000/api'

//add to Cart
export const addToCart = async (productId: number, quantity: number = 1) => {
  const token = localStorage.getItem('authToken'); 
  const response = await axios.post('http://localhost:5000/api/cart/add', { productId,quantity  },{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  
  return response.data;
};
