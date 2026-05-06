import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../_utils/dbConnect';
import { HeroBanner } from '../_utils/models';
import { requireAuth } from '../_utils/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const banners = await HeroBanner.find({}).sort({ priority: 1, created_at: -1 });
      return res.status(200).json(banners);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      requireAuth(req);
      const data = req.body;
      const banner = new HeroBanner(data);
      await banner.save();
      return res.status(200).json(banner);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      requireAuth(req);
      const { id } = req.query;
      await HeroBanner.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      requireAuth(req);
      const { id } = req.query;
      const data = req.body;
      const banner = await HeroBanner.findByIdAndUpdate(id, data, { new: true });
      return res.status(200).json(banner);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
