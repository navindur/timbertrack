import express, { Request, Response } from "express";
import promisePool from "../db";
import authenticateUser from "../middleware/authMiddleware";
import { RowDataPacket, OkPacket, ResultSetHeader } from "mysql2";

const router = express.Router();

// Type Definitions matching your database schema
interface Customer extends RowDataPacket {
  id: number;
  user_id: string;
  address?: string | null;
  phone_number?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

interface Order extends RowDataPacket {
  order_id: number;
  customer_id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  custom_order_id?: string | null;
  created_at: Date;
  updated_at?: Date;
}

interface CountResult extends RowDataPacket {
  count: number;
}

// Constants for validation
const ALLOWED_PAYMENT_METHODS = ['credit_card', 'paypal', 'bank_transfer', 'cash'];
const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_STATUSES = ["Pending", "Paid", "Failed"];

/**
 * ✅ Place a new order
 */
router.post("/", authenticateUser, async (req: Request, res: Response) => {
  const { customerId, totalAmount, paymentMethod, customOrderId, address, phoneNumber } = req.body;

  // Validate required fields
  if (!customerId || typeof customerId !== 'string') {
    return res.status(400).json({ message: "Valid customer ID is required" });
  }

  if (!totalAmount || isNaN(Number(totalAmount)) || Number(totalAmount) <= 0) {
    return res.status(400).json({ message: "Valid positive total amount is required" });
  }

  if (!paymentMethod || !ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
    return res.status(400).json({ 
      message: "Valid payment method is required",
      allowedMethods: ALLOWED_PAYMENT_METHODS
    });
  }

  let connection;
  try {
    connection = await promisePool.getConnection();
    await connection.beginTransaction();

    // Check or create customer
    const [existingCustomer] = await connection.query<Customer[]>(
      "SELECT * FROM customers WHERE user_id = ? FOR UPDATE",
      [customerId]
    );

    if (existingCustomer.length === 0) {
      await connection.query<ResultSetHeader>(
        "INSERT INTO customers (user_id, address, phone_number) VALUES (?, ?, ?)",
        [customerId, address || null, phoneNumber || null]
      );
    }

    // Create order
    const [orderResult] = await connection.query<OkPacket>(
      "INSERT INTO orders (customer_id, total_amount, payment_status, payment_method, custom_order_id) VALUES (?, ?, 'Pending', ?, ?)",
      [customerId, totalAmount, paymentMethod, customOrderId || null]
    );

    await connection.commit();

    return res.status(201).json({ 
      message: "Order placed successfully", 
      orderId: orderResult.insertId,
      customerId,
      totalAmount
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Order placement error:", error);
    
    if ((error as any).code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "Order with this custom ID already exists" });
    }
    
    return res.status(500).json({ 
      message: "Error placing order",
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  } finally {
    if (connection) connection.release();
  }
});

/**
 * ✅ Get all orders with pagination
 */
router.get("/", authenticateUser, async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    const [orders] = await promisePool.query<Order[]>(
      "SELECT * FROM orders LIMIT ? OFFSET ?",
      [Number(limit), offset]
    );

    const [[total]] = await promisePool.query<CountResult[]>(
      "SELECT COUNT(*) as count FROM orders"
    );

    return res.status(200).json({
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: total.count,
        totalPages: Math.ceil(total.count / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ 
      message: "Error fetching orders",
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

/**
 * ✅ Get a single order by ID
 */
router.get("/:id", authenticateUser, async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "Valid order ID is required" });
  }

  try {
    const [orders] = await promisePool.query<Order[]>(
      "SELECT * FROM orders WHERE order_id = ?",
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(orders[0]);
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ 
      message: "Error fetching order",
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

/**
 * ✅ Update order status & payment status
 */
router.put("/:id", authenticateUser, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "Valid order ID is required" });
  }

  if (status && !ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ 
      message: "Invalid order status",
      allowedStatuses: ORDER_STATUSES
    });
  }

  if (paymentStatus && !PAYMENT_STATUSES.includes(paymentStatus)) {
    return res.status(400).json({ 
      message: "Invalid payment status",
      allowedStatuses: PAYMENT_STATUSES
    });
  }

  try {
    const [result] = await promisePool.query<OkPacket>(
      "UPDATE orders SET status = COALESCE(?, status), payment_status = COALESCE(?, payment_status) WHERE order_id = ?",
      [status || null, paymentStatus || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ 
      message: "Error updating order",
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

/**
 * ✅ Delete an order
 */
router.delete("/:id", authenticateUser, async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: "Valid order ID is required" });
  }

  try {
    const [result] = await promisePool.query<OkPacket>(
      "DELETE FROM orders WHERE order_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res.status(500).json({ 
      message: "Error deleting order",
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

export default router;