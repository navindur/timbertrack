//db operations shop owner for dashboard data retrieval
import db from '../db';

//rturns SQL condition based on selected date range
const getDateCondition = (range: string): string => {
  switch (range) {
    case 'day':
      return 'DATE(created_at) = CURDATE()';
    case 'month':
      return 'YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())';
    case 'year':
      return 'YEAR(created_at) = YEAR(CURDATE())';
    default:
      return '1'; 
  }
};

// total standard + custom orders count
export const getTotalOrders = async (range: string): Promise<number> => {
  const dateCondition = getDateCondition(range);

  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS total FROM (
      SELECT id FROM orders WHERE ${dateCondition}
      UNION ALL
      SELECT custom_order_id FROM custom_orders 
      WHERE payment_status = 'paid' AND ${dateCondition.replace(/created_at/g, 'request_date')}
    ) AS combined_orders
    `
  );

  return (rows as any)[0].total;
};

//Count total active products
export const getTotalProducts = async (): Promise<number> => {
  const [rows] = await db.query(
    'SELECT COUNT(*) AS total FROM products WHERE is_active = TRUE'
  );
  return (rows as any)[0].total;
};

//Count customers registered
export const getTotalCustomers = async (range: string): Promise<number> => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total FROM customers WHERE ${getDateCondition(range)}`
  );
  return (rows as any)[0].total;
};

//inventory items that are low or below reorder level
export const getLowInventory = async (): Promise<any[]> => {
  const [rows] = await db.query(
    'SELECT * FROM inventory WHERE is_active = TRUE AND quantity <= reorder_level'
  );
  return rows as any[];
};

//normal orders + custom orders paid
export const getSalesRevenue = async (range: string): Promise<number> => {
  const dateCondition = getDateCondition(range);

  const [rows] = await db.query(
    `
    SELECT SUM(total) AS total_revenue FROM (
      SELECT total_price AS total 
      FROM orders 
      WHERE status != 'cancelled' AND ${dateCondition}
      
      UNION ALL
      
      SELECT estimated_price AS total 
      FROM custom_orders 
      WHERE payment_status = 'paid' AND ${dateCondition.replace(/created_at/g, 'request_date')}
    ) AS combined_revenue
    `
  );

  return (rows as any)[0].total_revenue || 0;
};

//latest 5 normal orders 
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

//latest 5 custom orders
export const getRecentCustomOrders = async (): Promise<any[]> => {
  const [rows] = await db.query(
    `SELECT 
      co.custom_order_id AS id,
      co.customer_id,
      CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
      co.estimated_price AS total_price,
      co.status,
      co.request_date AS created_at
    FROM custom_orders co
    JOIN customers c ON co.customer_id = c.customer_id
    
    ORDER BY co.request_date DESC
    LIMIT 5`
  );
  return rows as any[];
};

//sales trend data (count and sum) for normal orders 
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

//get sales trend data for paid custom orders
  export const getCustomSalesTrend = async (range: string): Promise<any[]> => {
  let groupBy, dateFormat, orderBy;

  switch (range) {
    case 'day':
      groupBy = 'DATE(request_date)';
      dateFormat = '%Y-%m-%d';
      orderBy = 'DATE(request_date)';
      break;
    case 'month':
      groupBy = 'DATE_FORMAT(request_date, "%Y-%m")';
      dateFormat = '%Y-%m';
      orderBy = 'DATE_FORMAT(request_date, "%Y-%m")';
      break;
    case 'year':
      groupBy = 'YEAR(request_date)';
      dateFormat = '%Y';
      orderBy = 'YEAR(request_date)';
      break;
    default:
      groupBy = 'DATE(request_date)';
      dateFormat = '%Y-%m-%d';
      orderBy = 'DATE(request_date)';
  }

  const [rows] = await db.query(
    `SELECT 
      ${groupBy} AS period,
      SUM(estimated_price) AS total_sales,
      COUNT(*) AS order_count
    FROM custom_orders
    WHERE payment_status = 'paid'
    GROUP BY period
    ORDER BY ${orderBy} ASC
    LIMIT 30`
  );

  return rows as any[];
};
