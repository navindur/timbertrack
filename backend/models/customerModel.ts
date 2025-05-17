import db from '../db';

interface Customer {
  customer_id?: number;
  user_id: number;
  first_name: string;
  last_name: string;
  phone_num: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
}

export const CustomerModel = {
  async createCustomer(customer: Customer): Promise<void> {
    const { user_id, first_name, last_name, phone_num, address_line1, address_line2, city, postal_code } = customer;

    await db.execute(
      `INSERT INTO customers 
        (user_id, first_name, last_name, phone_num, address_line1, address_line2, city, postal_code) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, first_name, last_name, phone_num, address_line1 || null, address_line2 || null, city || null, postal_code || null]
    );
  },

   async findByIdWithCustomer(orderId: number): Promise<any> {
    const [rows] = await db.execute(
      `SELECT co.*, 
              c.first_name, c.last_name, c.phone_num, 
              c.address_line1, c.address_line2, c.city, c.postal_code
       FROM custom_orders co
       JOIN customers c ON co.customer_id = c.customer_id
       WHERE co.custom_order_id = ?`,
      [orderId]
    );
    return (rows as any[])[0] || null;
  },


  

  async getCustomerByUserId(userId: number): Promise<Customer | null> {
    const [rows] = await db.execute(
      'SELECT * FROM customers WHERE user_id = ?',
      [userId]
    );
    return (rows as any[])[0] || null;
  },

  async updateCustomer(userId: number, updates: Partial<Customer>): Promise<void> {
    const fieldsToUpdate = [];
    const values = [];

    // Build dynamic update query
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        fieldsToUpdate.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fieldsToUpdate.length === 0) {
      return; // Nothing to update
    }

    values.push(userId); // For WHERE clause

    await db.execute(
      `UPDATE customers 
       SET ${fieldsToUpdate.join(', ')}
       WHERE user_id = ?`,
      values
    );
  },

  async getCustomerById(customerId: number): Promise<Customer | null> {
    const [rows] = await db.execute(
      'SELECT * FROM customers WHERE customer_id = ?',
      [customerId]
    );
    return (rows as any[])[0] || null;
  }
};