//owner side order handling db operations 
import db from '../db';
import { RowDataPacket } from 'mysql2';


interface Order extends RowDataPacket {
    id: number;
    customerId: number;
    status: string;
    totalPrice: number;
    paymentMethod: string;
    createdAt: Date;
  }

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}

interface OrderWithDetails extends RowDataPacket {
    id: number;
    customerId: number;
    status: string;
    totalPrice: number;
    paymentMethod: string;
    createdAt: Date;
    firstName: string;
    lastName: string;
    phoneNum: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    postalCode: string;
    items: {
      id: number;
      productId: number;
      quantity: number;
      price: number;
      name: string;
      imageUrl: string;
    }[];
  }

export const OrderModel = {
  async getOrdersByCustomer(customerId: number): Promise<Order[]> {
    const connection = await db.getConnection();
    try {
      const [orders] = await connection.query<Order[]>(`
        SELECT 
          id, 
          customer_id as customerId,
          status,
          total_price as totalPrice,
          payment_method as paymentMethod,
          created_at as createdAt
        FROM orders
        WHERE customer_id = ?
        ORDER BY created_at DESC
      `, [customerId]);
      
      return orders;
    } finally {
      connection.release();
    }
  },

  async getOrderWithDetails(orderId: number, customerId?: number): Promise<OrderWithDetails | null> {
    const connection = await db.getConnection();
    try {
      let query = `
        SELECT 
          o.id, 
          o.customer_id as customerId,
          o.status,
          o.total_price as totalPrice,
          o.payment_method as paymentMethod,
          o.created_at as createdAt,
          c.first_name as firstName,
          c.last_name as lastName,
          c.phone_num as phoneNum,
          c.address_line1 as addressLine1,
          c.address_line2 as addressLine2,
          c.city,
          c.postal_code as postalCode
        FROM orders o
        JOIN customers c ON o.customer_id = c.customer_id
        WHERE o.id = ?
      `;
      
      const params: any[] = [orderId];
      
      if (customerId) {
        query += ' AND o.customer_id = ?';
        params.push(customerId);
      }

      const [orderDetails] = await connection.query<OrderWithDetails[]>(query, params);

      if (!orderDetails.length) {
        return null;
      }

      const [items] = await connection.query<any[]>(`
        SELECT 
          oi.id,
          oi.product_id as productId,
          oi.quantity,
          oi.price,
          p.name,
          p.image_url as imageUrl
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [orderId]);

      return {
        ...orderDetails[0],
        items
      };
    } finally {
      connection.release();
    }
  }
};