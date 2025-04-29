// models/customerModel.ts
import db from '../db'; // your MySQL connection

interface Customer {
  id?: number;
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
      [user_id, first_name, last_name, phone_num, address_line1, address_line2, city, postal_code]
    );
  },

  async getCustomerByUserId(userId: number) {
    const [rows] = await db.execute(
      'SELECT * FROM customers WHERE user_id = ?',
      [userId]
    );
    const result = (rows as any[])[0];
    return result || null;
  }
};
