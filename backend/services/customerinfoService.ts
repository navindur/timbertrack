import db from '../db';
import { RowDataPacket } from 'mysql2';

interface Customer extends RowDataPacket {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_num: string;
  address: string;
  city: string;
  postal_code: string;
  created_at: string;
  order_count: number;
}

interface Order extends RowDataPacket {
  id: number;
  created_at: string;
  status: string;
  total_price: number;
  payment_method: string;
}

export const getCustomers = async (
  page: number,
  limit: number,
  search: string
) => {
  const offset = (page - 1) * limit;

  let query = `
    SELECT 
      c.customer_id,
      c.first_name,
      c.last_name,
      u.email,
      c.phone_num,
      CONCAT(c.address_line1, ' ', COALESCE(c.address_line2, '')) AS address,
      c.city,
      c.postal_code,
      c.created_at,
      COUNT(o.id) AS order_count
    FROM customers c
    JOIN users u ON c.user_id = u.id
    LEFT JOIN orders o ON c.customer_id = o.customer_id
  `;

  const whereClauses = [];
  const params: (string | number)[] = [];

  if (search) {
    whereClauses.push(`
      (c.first_name LIKE ? OR 
       c.last_name LIKE ? OR 
       u.email LIKE ? OR 
       c.phone_num LIKE ?)
    `);
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam, searchParam);
  }

  if (whereClauses.length > 0) {
    query += ` WHERE ${whereClauses.join(' AND ')}`;
  }

  query += `
    GROUP BY c.customer_id
    ORDER BY c.created_at DESC
    LIMIT ? OFFSET ?
  `;

  params.push(limit, offset);

  const [customers] = await db.query<Customer[]>(query, params);

  const [totalRows] = await db.query<RowDataPacket[]>(
    `
      SELECT COUNT(*) as total 
      FROM customers c
      JOIN users u ON c.user_id = u.id
      ${search ? `WHERE (c.first_name LIKE ? OR c.last_name LIKE ? OR u.email LIKE ? OR c.phone_num LIKE ?)` : ''}
    `,
    search ? [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`] : []
  );

  const total = (totalRows[0] as { total: number }).total;

  return {
    customers,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getCustomerById = async (id: number) => {
  const [customerRows] = await db.query<Customer[]>(
    `
      SELECT 
        c.customer_id,
        c.first_name,
        c.last_name,
        u.email,
        c.phone_num,
        c.address_line1,
        c.address_line2,
        c.city,
        c.postal_code,
        c.created_at,
        COUNT(o.id) AS order_count
      FROM customers c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN orders o ON c.customer_id = o.customer_id
      WHERE c.customer_id = ?
      GROUP BY c.customer_id
    `,
    [id]
  );

  if (customerRows.length === 0) return null;

  const [orders] = await db.query<Order[]>(
    `
      SELECT 
        id,
        created_at,
        status,
        total_price,
        payment_method
      FROM orders
      WHERE customer_id = ?
      ORDER BY created_at DESC
      LIMIT 5
    `,
    [id]
  );

  return {
    ...customerRows[0],
    orders,
  };
};
