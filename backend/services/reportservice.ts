// src/services/reportservice.ts

import db from '../db';

// Existing sales summary service
export const getSalesSummaryService = async (start: string, end: string) => {
  const [summary] = await db.execute(
    `
    SELECT 
      COUNT(*) AS total_orders,
      SUM(total_price) AS total_revenue,
      (
        SELECT SUM(oi.quantity)
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.created_at BETWEEN ? AND ?
      ) AS total_items_sold
    FROM orders
    WHERE created_at BETWEEN ? AND ?
    `,
    [start, end, start, end]
  );

  return Array.isArray(summary) ? summary[0] : summary;
};

// Sales by Product
export const getSalesByProductService = async (start: string, end: string) => {
  const [results] = await db.execute(
    `
    SELECT 
      p.id, p.name,
      SUM(oi.quantity) AS total_quantity,
      SUM(oi.quantity * oi.price) AS total_revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.created_at BETWEEN ? AND ?
    GROUP BY p.id, p.name
    `,
    [start, end]
  );
  return results;
};

// Sales by Category
export const getSalesByCategoryService = async (start: string, end: string) => {
  const [results] = await db.execute(
    `
    SELECT 
      i.type AS category,
      SUM(oi.quantity) AS total_quantity,
      SUM(oi.quantity * oi.price) AS total_revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN inventory i ON p.inventory_id = i.inventory_id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.created_at BETWEEN ? AND ?
    GROUP BY i.type
    `,
    [start, end]
  );
  return results;
};

// Sales by Payment Method
export const getSalesByPaymentMethodService = async (start: string, end: string) => {
  const [results] = await db.execute(
    `
    SELECT 
      payment_method,
      COUNT(*) AS order_count,
      SUM(total_price) AS revenue
    FROM orders
    WHERE created_at BETWEEN ? AND ?
    GROUP BY payment_method
    `,
    [start, end]
  );
  return results;
};

// Low Stock Alerts
export const getLowStockService = async () => {
  const [results] = await db.execute(
    `
    SELECT 
      inventory_id, name, quantity, reorder_level
    FROM inventory
    WHERE quantity <= reorder_level AND is_active = 1
    `
  );
  return results;
};

// Inventory Valuation
export const getInventoryValuationService = async () => {
  const [results] = await db.execute(
    `
    SELECT 
      inventory_id, name, type, quantity, price,
      (quantity * price) AS total_value
    FROM inventory
    WHERE is_active = 1
    `
  );
  return results;
};

// Top Customers
export const getTopCustomersService = async (start: string, end: string) => {
  const [results] = await db.execute(
    `
    SELECT 
      c.customer_id, u.email, c.first_name, c.last_name,
      SUM(o.total_price) AS total_spent,
      COUNT(o.id) AS total_orders
    FROM customers c
    JOIN users u ON c.user_id = u.id
    JOIN orders o ON o.customer_id = c.customer_id
    WHERE o.created_at BETWEEN ? AND ?
    GROUP BY c.customer_id
    ORDER BY total_spent DESC
    LIMIT 10
    `,
    [start, end]
  );
  return results;
};

// Customer Order History
export const getCustomerOrderHistoryService = async (customerId: string) => {
  const [results] = await db.execute(
    `
    SELECT 
      o.id AS order_id, o.created_at, o.total_price, o.status,
      oi.product_id, p.name AS product_name, oi.quantity, oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.customer_id = ?
    `,
    [customerId]
  );
  return results;
};

// Orders by Status
export const getOrdersByStatusService = async (start: string, end: string) => {
  const [results] = await db.execute(
    `
    SELECT 
      status,
      COUNT(*) AS count,
      SUM(total_price) AS revenue
    FROM orders
    WHERE created_at BETWEEN ? AND ?
    GROUP BY status
    `,
    [start, end]
  );
  return results;
};

// Order Details
export const getOrderDetailsService = async (orderId: string) => {
  const [order] = await db.execute(
    `
    SELECT 
      id, customer_id, created_at, status, total_price, payment_method
    FROM orders
    WHERE id = ?
    `,
    [orderId]
  );

  const [items] = await db.execute(
    `
    SELECT 
      oi.product_id, p.name AS product_name, oi.quantity, oi.price
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
    `,
    [orderId]
  );

  return {
    order: Array.isArray(order) ? order[0] : order,
    items
  };
};