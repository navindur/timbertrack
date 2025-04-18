import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home'; 
import Products from './pages/Products';
import Cart from './pages/Cart'; // Create this later
import SignUp from './pages/SignUp'; // Import the SignUp component
import SignIn from './pages/SignIn';
import ProductDetails from './pages/ProductDetails';
import Dashboard from './pages/Dashboard'; // Add this import
import ProductsDashboard from './pages/Productsdashboard'; // Add this import

const App: React.FC = () => {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={<SignUp />} /> {/* Add this route for the Sign Up page */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/productsdashboard" element={<ProductsDashboard />} />
        {/* Remove or keep the /profile route based on your needs */}
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </Router>
  );
};

export default App;