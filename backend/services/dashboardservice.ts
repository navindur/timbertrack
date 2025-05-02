import db from '../db';

// Utility function to get date filter condition
const getDateCondition = (range: string): string => {
  switch (range) {
    case 'day':
      return 'DATE(created_at) = CURDATE()';
    case 'month':
      return 'YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())';
    case 'year':
      return 'YEAR(created_at) = YEAR(CURDATE())';
    default:
      return '1'; // No filter (all time)
  }
};

// 1. Total Orders
export const getTotalOrders = async (range: string): Promise<number> => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total FROM orders WHERE ${getDateCondition(range)}`
  );
  return (rows as any)[0].total;
};

// 2. Total Active Products
export const getTotalProducts = async (): Promise<number> => {
  const [rows] = await db.query(
    'SELECT COUNT(*) AS total FROM products WHERE is_active = TRUE'
  );
  return (rows as any)[0].total;
};

// 3. Total Customers
export const getTotalCustomers = async (range: string): Promise<number> => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total FROM customers WHERE ${getDateCondition(range)}`
  );
  return (rows as any)[0].total;
};

// 4. Inventory nearing reorder level
export const getLowInventory = async (): Promise<any[]> => {
  const [rows] = await db.query(
    'SELECT * FROM inventory WHERE is_active = TRUE AND quantity <= reorder_level'
  );
  return rows as any[];
};

// 5. Sales Revenue
export const getSalesRevenue = async (range: string): Promise<number> => {
  const [rows] = await db.query(
    `SELECT SUM(total_price) AS total FROM orders WHERE status != 'cancelled' AND ${getDateCondition(range)}`
  );
  return (rows as any)[0].total || 0;
};

export const getRecentOrders = async (): Promise<any[]> => {
    const [rows] = await db.query(
      `SELECT 
        o.id,
        o.customer_id,
        CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
        o.total_price,
        o.status,
        o.created_at
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      ORDER BY o.created_at DESC
      LIMIT 5`
    );
    return rows as any[];
  };


  //new
// Get sales trend data
export const getSalesTrend = async (range: string): Promise<any[]> => {
    let groupBy, dateFormat, orderBy;
  
    switch (range) {
      case 'day':
        groupBy = 'DATE(created_at)';
        dateFormat = '%Y-%m-%d';
        orderBy = 'DATE(created_at)';
        break;
      case 'month':
        groupBy = 'DATE_FORMAT(created_at, "%Y-%m")';
        dateFormat = '%Y-%m';
        orderBy = 'DATE_FORMAT(created_at, "%Y-%m")';
        break;
      case 'year':
        groupBy = 'YEAR(created_at)';
        dateFormat = '%Y';
        orderBy = 'YEAR(created_at)';
        break;
      default:
        groupBy = 'DATE(created_at)';
        dateFormat = '%Y-%m-%d';
        orderBy = 'DATE(created_at)';
    }
  
    const [rows] = await db.query(
      `SELECT 
        ${groupBy} AS period,
        SUM(total_price) AS total_sales,
        COUNT(*) AS order_count
      FROM orders
      WHERE status != 'cancelled'
      GROUP BY period
      ORDER BY ${orderBy} ASC
      LIMIT 30`
    );
  
    return rows as any[];
  };