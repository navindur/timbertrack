import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RedirectHandler from './components/RedirectHandler';
import Home from './pages/Home'; 
import SignUp from './pages/SignUp'; 
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard'; 
import SupplierList from './pages/SupplierList';
import InventoryList from './pages/InventoryList';
import ProductList from './pages/ProductList';
import CustomerProductList from './pages/CustomerProductList';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import {Unauthorized} from './pages/Unauthorized';
import CustomerProfile from './pages/CustomerProfile';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmation from './pages/OrderConfirmation';
import AllOrderView from './pages/AllOrderView';
import AboutUsPage from './pages/AboutUsPage';
import OrderList from './pages/OrderList';
import OwnerOrderDetail from './pages/ownerOrderDetail';
import WalkinOrder from './pages/WalkinOrder';
import WalkinReceipt from './pages/WalkinReceipt';
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import ReportsDashboard from './pages/ReportsDashboard';
import { AuthProvider } from './context/AuthContext'; 
import CustomOrderPage from "./pages/CustomOrderPage"; 
import MyCustomOrdersPage from "./pages/MyCustomOrdersPage"; 
import ShopOwnerCustomOrders from "./pages/ShopOwnerCustomOrders"; 
import CustomOrderCheckout from "./pages/CustomOrderCheckout"; 
import CustomOrderReceipt from './pages/CustomOrderReceipt';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const App: React.FC = () => {

  return (
    <Router>
      {/* Provide authentication context to the app */}
      <AuthProvider>   
        {/* Handles redirects based on auth state */}      
         <RedirectHandler /> 
      
      <Routes>
        {/* Public routes */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/signup" element={<SignUp />} /> 
      <Route path="/signin" element={<SignIn />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/order-confirmation/:order_id" element={<OrderConfirmation />} />

{/* Shop owner protected routes */}
      <Route element={<ProtectedRoute allowedRoles={['shopowner']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/supplierlist" element={<SupplierList />} />
        <Route path="/inventorylist" element={<InventoryList />} />
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/ownerorders" element={<OrderList />} />
        <Route path="/ownerorders/:id" element={<OwnerOrderDetail />} />
        <Route path="/walkin-order" element={<WalkinOrder />} />
        <Route path="/walkin-orders/:id/receipt" element={<WalkinReceipt />} />
        <Route path="/customerinfo" element={<CustomerList />} />
        <Route path="/customerinfo/:id" element={<CustomerDetail />} />
        <Route path="/reports" element={<ReportsDashboard />} />
        <Route path="/ownercustom-ordersview" element={<ShopOwnerCustomOrders />} /> 
      </Route>

                {/* Customer protected routes */}
      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />  
        <Route path="/allorderview" element={<AllOrderView />} /> 
        <Route path="/custom-order" element={<CustomOrderPage />} /> 
        <Route path="/my-custom-orders" element={<MyCustomOrdersPage />} />  
        <Route path="/custom-order-checkout/:orderId" element={<CustomOrderCheckout />} /> 
      </Route>
{/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/customerprofile" element={<CustomerProfile />} />
        <Route path="/products" element={<CustomerProductList />} />
        <Route path="/categories/:category" element={<CategoryPage />} /> 
        <Route path="/productsview/:id" element={<ProductDetailPage />} />//new
        <Route path="/custom-orders/:orderId/receipt" element={<CustomOrderReceipt />} />

      </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;