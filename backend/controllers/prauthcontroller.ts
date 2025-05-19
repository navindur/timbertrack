import { Request, Response } from 'express';
import pool from '../db';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sendResetEmail } from '../services/emailservice';

// POST /auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const [users]: any = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour

    await pool.query(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
      [users[0].id, token, expiresAt]
    );

    await sendResetEmail(email, token);
    res.json({ message: 'Reset link sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: 'Token and new password required' });

  try {
    const [results]: any = await pool.query(
      'SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()',
      [token]
    );

    if (results.length === 0) return res.status(400).json({ message: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = results[0].user_id;

    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    await pool.query('DELETE FROM password_resets WHERE user_id = ?', [userId]);

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
