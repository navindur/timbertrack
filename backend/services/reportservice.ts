// src/services/reportservice.ts

import db from '../db';
import { RowDataPacket } from 'mysql2/promise';


// src/services/reportservice.ts

interface RegularOrderSummary {
  total_regular_orders: number;
  total_regular_revenue: number;
  total_items_sold: number;
}

interface CustomOrderSummary {
  total_custom_orders: number;
  total_custom_revenue: number;
}

interface SalesSummaryResult {
  total_orders: number;
  total_revenue: number;
  total_items_sold: number;
  regular_orders: number;
  regular_revenue: number;
  custom_orders: number;
  custom_revenue: number;
  regular_percentage: number;
  custom_percentage: number;
}

interface RegularSummaryRow extends RowDataPacket {
  total_regular_orders: number;
  total_regular_revenue: number;
  total_items_sold: number;
}

interface CustomSummaryRow extends RowDataPacket {
  total_custom_orders: number;
  total_custom_revenue: number;
}

export const getSalesSummaryService = async (start: string, end: string): Promise<SalesSummaryResult> => {
  // Regular orders summary
  const [regularRows] = await db.query<RegularSummaryRow[]>(
    `
    SELECT 
      COUNT(*) AS total_regular_orders,
      COALESCE(SUM(total_price), 0) AS total_regular_revenue,
      COALESCE((
        SELECT SUM(oi.quantity)
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.created_at BETWEEN ? AND ?
      ), 0) AS total_items_sold
    FROM orders
    WHERE created_at BETWEEN ? AND ?
    `,
    [start, end, start, end]
  );

  // Custom orders summary
  const [customRows] = await db.query<CustomSummaryRow[]>(
    `
    SELECT 
      COUNT(*) AS total_custom_orders,
      COALESCE(SUM(estimated_price), 0) AS total_custom_revenue
    FROM custom_orders
    WHERE payment_status = 'paid' 
      AND request_date BETWEEN ? AND ?
    `,
    [start, end]
  );

  const regularData = regularRows[0] || {
    total_regular_orders: 0,
    total_regular_revenue: 0,
    total_items_sold: 0
  };

  const customData = customRows[0] || {
    total_custom_orders: 0,
    total_custom_revenue: 0
  };

const regularRevenue = Number(regularData.total_regular_revenue) || 0;
const customRevenue = Number(customData.total_custom_revenue) || 0;

const total_orders = regularData.total_regular_orders + customData.total_custom_orders;
const total_revenue = regularRevenue + customRevenue;

const regular_percentage = total_revenue > 0
  ? Math.round((regularRevenue / total_revenue) * 100)
  : 0;

const custom_percentage = total_revenue > 0
  ? Math.round((customRevenue / total_revenue) * 100)
  : 0;

return {
  total_orders,
  total_revenue,
  total_items_sold: regularData.total_items_sold,
  regular_orders: regularData.total_regular_orders,
  regular_revenue: regularRevenue,
  custom_orders: customData.total_custom_orders,
  custom_revenue: customRevenue,
  regular_percentage,
  custom_percentage
};
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
    FROM (
      SELECT 
        payment_method,
        total_price
      FROM orders
      WHERE created_at BETWEEN ? AND ?

      UNION ALL

      SELECT 
        'credit_card' AS payment_method,
        estimated_price AS total_price
      FROM custom_orders
      WHERE request_date BETWEEN ? AND ?
        AND payment_status = 'paid'
    ) AS combined
    GROUP BY payment_method
    `,
    [start, end, start, end]
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
      c.customer_id,
      u.email,
      c.first_name,
      c.last_name,
      COALESCE(o_stats.total_order_spent, 0) + COALESCE(co_stats.total_custom_spent, 0) AS total_spent,
      COALESCE(o_stats.order_count, 0) + COALESCE(co_stats.custom_order_count, 0) AS total_orders
    FROM customers c
    JOIN users u ON c.user_id = u.id
    LEFT JOIN (
      SELECT 
        customer_id, 
        SUM(total_price) AS total_order_spent, 
        COUNT(*) AS order_count
      FROM orders
      WHERE created_at BETWEEN ? AND ?
      GROUP BY customer_id
    ) AS o_stats ON o_stats.customer_id = c.customer_id
    LEFT JOIN (
      SELECT 
        customer_id, 
        SUM(estimated_price) AS total_custom_spent, 
        COUNT(*) AS custom_order_count
      FROM custom_orders
      WHERE request_date BETWEEN ? AND ? AND payment_status = 'paid'
      GROUP BY customer_id
    ) AS co_stats ON co_stats.customer_id = c.customer_id
    ORDER BY total_spent DESC
    LIMIT 10
    `,
    [start, end, start, end]
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


export const getCustomOrdersByStatusService = async (start: string, end: string) => {
  const [results] = await db.execute(
    `
    SELECT 
      status,
      COUNT(*) AS count,
      SUM(estimated_price) AS total_estimated_price
    FROM custom_orders
    WHERE request_date BETWEEN ? AND ?
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