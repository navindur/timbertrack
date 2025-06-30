import express from "express";
const cors = require("cors");
import * as dotenv from "dotenv";
import promisePool from "./db"; // Database connection pool

// Import route modules
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

// Product management routes
app.use('/api/products', productsRoutes);                    // Admin product CRUD
app.use('/api/customer/products', customerProductRoutes);    // Customer product browsing
app.use('/api/categories', categoryRoutes);                  // Product categories
app.use('/api/productview', productviewRoutes);              // Product detail views

// Customer management routes
app.use('/api/customers', customerprofileRoutes);            // Customer profiles
app.use('/api/customerinfo', customerinfoRoutes);            // Customer information for admin

// Shopping and order management routes
app.use('/api/cart', cartRoutes);                           // Shopping cart operations
app.use('/api/orders', orderRoutes);                        // Order processing
app.use('/api/allorderview', viewallorderroutes);           // Order viewing for customers
app.use('/api/ownerorders', ownerorderRoutes);              // Order management for shop owners
app.use('/api/walkin-orders', walkinOrderRoutes);           // Walk-in order processing
app.use("/api/custom-orders", customOrderRoutes);           // Custom furniture orders

// Business management routes
app.use('/api/suppliers', supplierRoutes);                  // Supplier management
app.use('/api', inventoryRoutes);                          // Inventory management
app.use('/api/dashboard', dashboardRoutes);                 // Dashboard analytics
app.use('/api/reports', reportRoutes);                      // Business reports


app.listen(PORT, () => {
  console.log(`TimberTrack Server is running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});

export default app;
