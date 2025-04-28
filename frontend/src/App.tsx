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
import ProductDetailPage from './pages/ProductDetailPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute'; //neww
import {Unauthorized} from './pages/Unauthorized';//new
import CustomerProfile from './pages/CustomerProfile';

const App: React.FC = () => {
  return (
    <Router>
      
      <Routes>
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/signup" element={<SignUp />} /> 
      <Route path="/signin" element={<SignIn />} />

      <Route element={<ProtectedRoute allowedRoles={['shopowner']} />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/inventorydash" element={<InventoryDash />} />
        <Route path="/ordersdash" element={<OrdersDash />} />
        <Route path="/suppliersdash" element={<SuppliersDash />} />
        <Route path="/reportsdash" element={<ReportsDash />} />
        <Route path="/usermanagementdash" element={<UserManagementDash />} />
        <Route path="/supplierlist" element={<SupplierList />} />
        <Route path="/inventorylist" element={<InventoryList />} />
        <Route path="/productlist" element={<ProductList />} />
      </Route>


      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
       
      </Route>

        <Route path="/" element={<Home />} />
        
        <Route path="/cart" element={<Cart />} />
        
        <Route path="/products/:id" element={<ProductDetails />} />
        

        <Route path="/customerprofile" element={<CustomerProfile />} />
        
        
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