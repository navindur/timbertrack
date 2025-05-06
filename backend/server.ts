import express from "express";
const cors = require("cors");
import * as dotenv from "dotenv";
import promisePool from "./db"; // Import the DB connection file
//import productRoutes from "./routes/productRoutes"; // Adjust the path as needed
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
import reportRoutes from './routes/reportroutes';//new


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Test database connection
promisePool.query("SELECT 1")
  .then(() => console.log("Database connection successful"))
  .catch((error) => console.error("Database connection failed:", error));

// Routes
app.get("/", (req, res) => {
  res.send("Hello, Express with TypeScript!");
});


app.use('/api/products', productsRoutes);
app.use('/api/customer/products', customerProductRoutes);
app.use('/api/categories', categoryRoutes);


app.use('/api/productview', productviewRoutes);

app.use("/api", authRoutes); // Add authentication routes


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.use('/api/suppliers', supplierRoutes);
app.use('/api', inventoryRoutes);


app.use('/api/customers', customerprofileRoutes); 

app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/allorderview', viewallorderroutes);
app.use('/api/ownerorders', ownerorderRoutes);
app.use('/api/walkin-orders', walkinOrderRoutes);

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/customerinfo', customerinfoRoutes); 
app.use('/api/reports', reportRoutes); //new

export default app;