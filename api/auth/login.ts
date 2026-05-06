import type { VercelRequest, VercelResponse } from '@vercel/node';
import { signToken } from '../_utils/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';

  if (email === adminEmail && password === adminPassword) {
    const token = signToken({ email, role: 'admin' });
    return res.status(200).json({ token, user: { email, role: 'admin' } });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
}
