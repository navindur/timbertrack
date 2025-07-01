import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

//type definition for cart item
interface CartItem {
  id: number;
  name: string;
  image_url: string;
  quantity: number;
  product_id: number;
  price: number;
  inventory_quantity: number;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      console.log('No token found, redirecting to signin...');
      navigate('/signin', { replace: true });
      return;
    }
  
    const fetchCart = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/cart`, {//fetch cart items from backend
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const items = res.data.cartItems ?? [];  
          setCartItems(items);
        } catch (error) {
          console.error('Error fetching cart:', error);
        } finally {
          setLoading(false);
        }
      };
      
  
    fetchCart();
  }, [navigate]);
  
  const handleDeleteItem = async (itemId: number) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/cart/delete/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  
  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    const token = localStorage.getItem('authToken');
    const item = cartItems.find(item => item.id === itemId);
    
    if (!item) return;
  
    //prevent exceeding available inventory
    if (newQuantity > item.inventory_quantity) {
      alert(`Only ${item.inventory_quantity} items available in stock`);
      return;
    }
  
    if (newQuantity < 1) {
      newQuantity = 1;
    }
  
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/cart/update/${itemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDeleteAll = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await Promise.all(
        cartItems.map(item => 
          axios.delete(`${import.meta.env.VITE_API_BASE_URL}/cart/delete/${item.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setCartItems([]);
    } catch (error) {
      console.error("Error deleting all items:", error);
    }
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };

  //show loading indicator while fetching data
  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <>
    <Navbar />
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
  
      {cartItems.length === 0 ? (//empty cart
        <div className="text-gray-500 text-center">Your cart is empty.</div>
      ) : (
        <>
          <div className="grid gap-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center border rounded-lg p-4 shadow-sm">
                <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4" />
                <div className="flex-1">
  <h2 className="text-lg font-semibold">{item.name}</h2>
  <div className="flex items-center gap-4">
    <p className="text-gray-600">
      Quantity: {item.quantity} 
      <span className="text-sm text-gray-500 ml-2">
        (Max: {item.inventory_quantity})
      </span>
    </p>
    <button 
      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} 
      className="px-2 bg-gray-200 rounded"
      disabled={item.quantity >= item.inventory_quantity} // Disable if max reached
    >
      +
    </button>
    <button 
      onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))} 
      className="px-2 bg-gray-200 rounded"
    >
      -
    </button>
  </div>
  <p className="text-gray-800 font-medium">
    Price: Rs.{(item.price * item.quantity).toFixed(2)}
  </p>
</div>
                <button 
                  onClick={() => handleDeleteItem(item.id)} 
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
  
          <div className="flex justify-between items-center border-t pt-4">
            <div className="text-xl font-bold">
              Total: Rs.{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete All
              </button>
              <button 
                onClick={handleCheckout} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
    <Footer />
    </>
  );
};

export default CartPage;
