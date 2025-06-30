import db from '../db';
import { RowDataPacket, OkPacket } from 'mysql2';

export interface Order {
  id: number;
  customer_id: number;
  created_at: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_price: number;
  payment_method: 'cash_on_delivery' | 'credit_card';
  updated_at: Date;
}

export interface OrderWithDetails extends Order {
  customer_name: string;
  customer_email: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name: string;
  product_image?: string;
}

export const getAllOrders = async (
    page: number = 1,
    limit: number = 10,
    status?: string,
    searchTerm?: string
  ): Promise<{ orders: Order[]; total: number }> => {
    const offset = (page - 1) * limit;
    
    let baseQuery = `
      SELECT o.*, 
             CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
             u.email AS customer_email
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      JOIN users u ON c.user_id = u.id
    `;
    
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      JOIN users u ON c.user_id = u.id
    `;
    
    const whereClauses: string[] = [];
    const queryParams: any[] = [];
    const countParams: any[] = [];
  
    if (status) {
      whereClauses.push('o.status = ?');
      queryParams.push(status);
      countParams.push(status);
    }
  
    if (searchTerm && searchTerm.trim() !== '') {
      const searchConditions: string[] = [];
      const searchParams: any[] = [];
  
      const orderId = parseInt(searchTerm);
      if (!isNaN(orderId)) {
        searchConditions.push('o.id = ?');
        searchParams.push(orderId);
      }
     
      const nameParts = searchTerm.trim().split(/\s+/);
      if (nameParts.length > 0) {
        searchConditions.push('(c.first_name LIKE ? OR c.last_name LIKE ?)');
        searchParams.push(`%${nameParts[0]}%`, `%${nameParts[0]}%`);
        
        if (nameParts.length > 1) {
          searchConditions.push('(c.first_name LIKE ? OR c.last_name LIKE ?)');
          searchParams.push(`%${nameParts[1]}%`, `%${nameParts[1]}%`);
        }
      }
    
      if (/^\d{4}-\d{2}-\d{2}$/.test(searchTerm)) {
        searchConditions.push('DATE(o.created_at) = ?');
        searchParams.push(searchTerm);
      } else if (/^\d{4}-\d{2}$/.test(searchTerm)) {
        searchConditions.push('DATE_FORMAT(o.created_at, "%Y-%m") = ?');
        searchParams.push(searchTerm);
      } else if (/^\d{4}$/.test(searchTerm)) {
        searchConditions.push('YEAR(o.created_at) = ?');
        searchParams.push(searchTerm);
      }
      
      if (searchConditions.length > 0) {
        whereClauses.push(`(${searchConditions.join(' OR ')})`);
        queryParams.push(...searchParams);
        countParams.push(...searchParams);
      }
    }
  
    if (whereClauses.length > 0) {
      const whereClause = ' WHERE ' + whereClauses.join(' AND ');
      baseQuery += whereClause;
      countQuery += whereClause;
    }

    baseQuery += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);
  
    console.log('Executing query:', baseQuery);
    console.log('With parameters:', queryParams);
  
    const [orders] = await db.query<RowDataPacket[]>(baseQuery, queryParams);
    const [totalRows] = await db.query<RowDataPacket[]>(countQuery, countParams);
  
    return {
      orders: orders as Order[],
      total: totalRows[0].total
    };
  };

export const getOrderById = async (orderId: number): Promise<OrderWithDetails | null> => {
  
  const [orderRows] = await db.query<RowDataPacket[]>(`
    SELECT o.*, 
           CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
           u.email AS customer_email,
           c.phone_num AS customer_phone,
           CONCAT(c.address_line1, ' ', COALESCE(c.address_line2, '')) AS customer_address,
           c.city AS customer_city,
           c.postal_code AS customer_postal_code
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN users u ON c.user_id = u.id
    WHERE o.id = ?
  `, [orderId]);

  if (orderRows.length === 0) {
    return null;
  }
  
  const [itemRows] = await db.query<RowDataPacket[]>(`
    SELECT oi.*, p.name AS product_name, p.image_url AS product_image
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `, [orderId]);

  return {
    ...(orderRows[0] as OrderWithDetails),
  items: itemRows as OrderItem[]
  };
};

export const updateOrderStatus = async (
  orderId: number,
  newStatus: string
): Promise<boolean> => {
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(newStatus)) {
    throw new Error('Invalid order status');
  }

  const [result] = await db.query<OkPacket>(`
    UPDATE orders 
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [newStatus, orderId]);

  return result.affectedRows > 0;
};