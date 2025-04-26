import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home'; 

import Cart from './pages/Cart'; // Create this later
import SignUp from './pages/SignUp'; // Import the SignUp component
import SignIn from './pages/SignIn';
import ProductDetails from './pages/ProductDetails';
import Dashboard from './pages/Dashboard'; // Add this import

import InventoryDash from './pages/InventoryDash';
import OrdersDash from './pages/OrdersDash';
import SuppliersDash from './pages/SuppliersDash';
import ReportsDash from './pages/ReportsDash';
import UserManagementDash from './pages/UserManagementDash';
import SupplierList from './pages/SupplierList';
import InventoryList from './pages/InventoryList';
import ProductList from './pages/ProductList';
import CustomerProductList from './pages/CustomerProductList';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';//new



const App: React.FC = () => {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={<SignUp />} /> {/* Add this route for the Sign Up page */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/inventorydash" element={<InventoryDash />} />
        <Route path="/ordersdash" element={<OrdersDash />} />
        <Route path="/suppliersdash" element={<SuppliersDash />} />
        <Route path="/reportsdash" element={<ReportsDash />} />
        <Route path="/usermanagementdash" element={<UserManagementDash />} />
        <Route path="/supplierlist" element={<SupplierList />} />
        <Route path="/inventorylist" element={<InventoryList />} />
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/products" element={<CustomerProductList />} />
        <Route path="/categories/:category" element={<CategoryPage />} /> 
        <Route path="/productsview/:id" element={<ProductDetailPage />} />//new
        
        {/* Remove or keep the /profile route based on your needs */}
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </Router>
  );
};

export default App;