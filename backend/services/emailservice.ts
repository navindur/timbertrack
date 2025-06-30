//mail sender for passowrd reset
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'timbertrack243@gmail.com',
    pass: 'uakt hest xjkr vizs', 
  },
});

export const sendResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:5173/reset-password?token=${token}`;
  await transporter.sendMail({
    from: '"TimberTrack Support" <timbertrack243@gmail.com>',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h2>Reset Your Password</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link is valid for 1 hour.</p>
    `,
  });
};
