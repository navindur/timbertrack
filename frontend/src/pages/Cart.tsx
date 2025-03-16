import React from 'react';

const Cart: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-blue-600">Your Cart</h1>
      <p className="mt-2 text-gray-600">Review your items before checkout.</p>
    </div>
  );
};

export default Cart;