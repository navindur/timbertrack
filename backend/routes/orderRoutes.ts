import express, { Request, Response } from "express";
import promisePool from "../db"; // Database connection
import authenticateUser from "../middleware/authMiddleware"; // Middleware for authentication

const router = express.Router();

// ✅ Place a new order
router.post("/", authenticateUser, async (req: Request, res: Response) => {
  const { customerId, totalAmount, paymentMethod, customOrderId, address, phoneNumber } = req.body;

  if (!customerId || !totalAmount || !paymentMethod) {
    return res.status(400).json({ message: "Customer ID, total amount, and payment method are required" });
  }

  try {
    // Check if the customer exists in the customers table
    const [existingCustomer]: any = await promisePool.query(
      "SELECT * FROM customers WHERE user_id = ?",
      [customerId]
    );

    // If the customer doesn't exist, insert the customer data into the customers table
    if (existingCustomer.length === 0) {
      const [result]: any = await promisePool.query(
        "INSERT INTO customers (user_id, address, phone_number) VALUES (?, ?, ?)",
        [customerId, address || null, phoneNumber || null]
      );
    }

    // Now proceed with placing the order
    const [orderResult]: any = await promisePool.query(
      "INSERT INTO orders (customer_id, total_amount, payment_status, payment_method, custom_order_id) VALUES (?, ?, 'Pending', ?, ?)",
      [customerId, totalAmount, paymentMethod, customOrderId || null]
    );

    return res.status(201).json({ message: "Order placed successfully", orderId: orderResult.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error placing order" });
  }
});



// ✅ Get all orders
router.get("/", authenticateUser, async (req: Request, res: Response) => {
  try {
    const [orders] = await promisePool.query("SELECT * FROM orders");
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching orders" });
  }
});

// ✅ Get a single order by ID
router.get("/:id", authenticateUser, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [order] = await promisePool.query("SELECT * FROM orders WHERE order_id = ?", [id]);

    if ((order as any).length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching order" });
  }
});

// ✅ Update order status & payment status
router.put("/:id", authenticateUser, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  if (status && !["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  if (paymentStatus && !["Pending", "Paid", "Failed"].includes(paymentStatus)) {
    return res.status(400).json({ message: "Invalid payment status" });
  }

  try {
    await promisePool.query(
      "UPDATE orders SET status = COALESCE(?, status), payment_status = COALESCE(?, payment_status) WHERE order_id = ?",
      [status || null, paymentStatus || null, id]
    );
    return res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating order" });
  }
});

// ✅ Delete an order
router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await promisePool.query("DELETE FROM orders WHERE order_id = ?", [id]);
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting order" });
  }
});

export default router;
