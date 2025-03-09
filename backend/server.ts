import express from "express";
const cors = require("cors");
import * as dotenv from "dotenv";
import promisePool from "./db"; // Import the DB connection file
import productRoutes from "./routes/productRoutes"; // Adjust the path as needed
import authRoutes from "./routes/authRoutes";

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

// Register product routes
app.use("/products", productRoutes);

app.use("/auth", authRoutes); // Add authentication routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});