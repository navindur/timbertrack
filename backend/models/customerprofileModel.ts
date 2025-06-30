import db from '../db';

//hnadle db operations related to customer profile in customer side
interface Customer {
  user_id: number;
  first_name: string;
  last_name: string;
  phone_num: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
  email?: string;
}

interface UserInfo {
  id: number;
  email: string;
}

export const CustomerModel = {
  async getByUserId(userId: number): Promise<Customer | null> {
    const [rows] = await db.execute(
      `SELECT c.*, u.email 
       FROM customers c
       JOIN users u ON c.user_id = u.id
       WHERE c.user_id = ?`,
      [userId]
    );
    return (rows as Customer[])[0] || null;
  },

  async update(userId: number, customerData: Omit<Customer, 'user_id'>): Promise<void> {
    const { first_name, last_name, phone_num, address_line1, address_line2, city, postal_code } = customerData;
    
    await db.execute(
      `UPDATE customers 
       SET first_name = ?, last_name = ?, phone_num = ?,
           address_line1 = ?, address_line2 = ?, city = ?, postal_code = ?
       WHERE user_id = ?`,
      [first_name, last_name, phone_num, address_line1, address_line2, city, postal_code, userId]
    );
  },

  async create(customerData: Customer): Promise<void> {
    const { user_id, first_name, last_name, phone_num, address_line1, address_line2, city, postal_code } = customerData;
    
    await db.execute(
      `INSERT INTO customers 
       (user_id, first_name, last_name, phone_num, address_line1, address_line2, city, postal_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, first_name, last_name, phone_num, address_line1, address_line2, city, postal_code]
    );
  },

  async checkEmailExists(email: string): Promise<boolean> {
    const [rows] = await db.execute(
      `SELECT COUNT(*) as count FROM users WHERE email = ?`,
      [email]
    );
    return (rows as any)[0].count > 0;
  },

  async updateUserEmail(userId: number, newEmail: string): Promise<void> {
    await db.execute(
      `UPDATE users SET email = ? WHERE id = ?`,
      [newEmail, userId]
    );
  },

  async getUserById(userId: number): Promise<UserInfo | null> {
    const [rows] = await db.execute(
      `SELECT id, email FROM users WHERE id = ?`,
      [userId]
    );
    return (rows as UserInfo[])[0] || null;
  },

  isValidEmail(email: string): boolean {
    return /^(?!\.)(?!.*\.\.)[A-Z0-9._%+-]+(?<!\.)@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  }
};