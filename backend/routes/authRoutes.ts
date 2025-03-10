import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // For generating JWT
import promisePool from "../db"; // Import DB connection
import { RowDataPacket } from "mysql2";

const router = express.Router();

// User Registration (existing code)
router.post("/register", async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const [existingUser]: [RowDataPacket[], any] = await promisePool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into the database
    const [result]: [any, any] = await promisePool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role || "customer"]
    );

    return res.status(201).json({ message: "User registered successfully", id: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error registering user" });
  }
});

// User Login
router.post("/login", async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const [users]: [RowDataPacket[], any] = await promisePool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-strong-secret-key", // Use a strong secret key in production
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Send the token and user details (excluding password)
    const { password: _, ...userWithoutPassword } = user; // Exclude password from the response
    return res.status(200).json({ message: "Login successful", token, user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error during login" });
  }
});

export default router;