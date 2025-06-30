import db from '../db'; 

//shape of a User object
interface User {
  id?: number;
  email: string;
  password: string;
  role?: 'customer' | 'shopowner';
}

//handles database operations related to users
export const UserModel = {
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const result = (rows as any[])[0]; //get the first result
    return result || null;
  },

  async createUser(user: User): Promise<User> {
    const { email, password, role = 'customer' } = user;
    const [result] = await db.execute(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, password, role]
    );
    const insertedId = (result as any).insertId;
    return { id: insertedId, email, password, role }; ///return user object including the generated ID
  }
};
