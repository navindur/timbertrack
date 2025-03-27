import express, { Request, Response } from "express";
import promisePool from "../db"; // Adjust the path as needed
import { RowDataPacket, ResultSetHeader } from "mysql2"; // Import the correct types from mysql2

const router = express.Router();

// GET all products
router.get("/", async (req: Request, res: Response) => {
  try {
    // Query the database to fetch all products
    const [rows]: [RowDataPacket[], any] = await promisePool.query("SELECT * FROM products");
    res.json(rows); // Send the data as a response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving products" });
  }
});

// GET a single product by id
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Query the database to fetch a single product
    const [rows]: [RowDataPacket[], any] = await promisePool.query("SELECT * FROM products WHERE id = ?", [id]);

    if (rows.length > 0) {
      res.json(rows[0]); // Send the single product as a response
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving product" });
  }
});

// POST a new product
router.post("/", async (req: Request, res: Response) => {
  const { name, description, price, category, material } = req.body;

  // Validate that all required fields are present
  if (!name || !price || !category || !material) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result]: [ResultSetHeader, any] = await promisePool.query(
      "INSERT INTO products (name, description, price, category, material) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, category, material]
    );
    res.status(201).json({ message: "Product added", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product" });
  }
});


// DELETE a product by id
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Delete the product from the database
    const [result]: [ResultSetHeader, any] = await promisePool.query("DELETE FROM products WHERE id = ?", [id]);

    if (result.affectedRows > 0) {
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

// Export the router
export default router;