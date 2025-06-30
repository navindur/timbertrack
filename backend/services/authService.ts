//only for password change
import db from '../db';
import bcrypt from 'bcryptjs';

//handle db operations realted to password change
export const authService = {
  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    const user = (rows as any[])[0];
    
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
  }
};