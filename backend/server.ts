import express from "express";
const cors = require("cors");
import * as dotenv from "dotenv";
import promisePool from "./db"; 


import authRoutes from "./routes/authRoutes";
import supplierRoutes from './routes/supplierRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import productsRoutes from './routes/productRoutes';
import customerProductRoutes from './routes/customerProductRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productviewRoutes from './routes/productviewRoutes';
import customerprofileRoutes from './routes/customerprofileRoutes';
import cartRoutes from './routes/cartRoutes'; 
import orderRoutes from './routes/orderRoutes';
import viewallorderroutes from './routes/viewallorderroutes'; 
import ownerorderRoutes from './routes/ownerorderRoutes';
import walkinOrderRoutes from './routes/walkinOrderRoutes';
import dashboardRoutes from './routes/dashboardroutes';
import customerinfoRoutes from './routes/customerinfoRoutes';
import reportRoutes from './routes/reportroutes';
import customOrderRoutes from "./routes/customOrderRoutes";
import prauthRoutes from './routes/prauthroutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

promisePool.query("SELECT 1")
  .then(() => console.log("Database connection successful"))
  .catch((error) => console.error("Database connection failed:", error));

app.get("/", (req, res) => {
  res.send("TimberTrack API Server - Running Successfully!");
});
app.use("/api", authRoutes);
app.use('/api/auth', prauthRoutes);

//product management routes
app.use('/api/products', productsRoutes); // shop owner product CRUD
app.use('/api/customer/products', customerProductRoutes);// Customer product browsing
app.use('/api/categories', categoryRoutes); ///product categories
app.use('/api/productview', productviewRoutes);// Product detail view

//customer management routes
app.use('/api/customers', customerprofileRoutes); // Customer profile
app.use('/api/customerinfo', customerinfoRoutes); // Customer info for owner

// order management routes
app.use('/api/cart', cartRoutes); //cart operations
app.use('/api/orders', orderRoutes); // Order processing
app.use('/api/allorderview', viewallorderroutes);  // Order viewing for customers
app.use('/api/ownerorders', ownerorderRoutes);   // Order management for shop owner
app.use('/api/walkin-orders', walkinOrderRoutes); // Walk-in orders
app.use("/api/custom-orders", customOrderRoutes); // Custom orders


app.use('/api/suppliers', supplierRoutes); // Supplier detilas
app.use('/api', inventoryRoutes); // Inventory 
app.use('/api/dashboard', dashboardRoutes); // Dashboard
app.use('/api/reports', reportRoutes);//reports


app.listen(PORT, () => {
  console.log(`TimberTrack Server is running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});

export default app;
