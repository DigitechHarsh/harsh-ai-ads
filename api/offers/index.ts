import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../_utils/dbConnect.js';
import { OfferTracker } from '../_utils/models.js';
import { requireAuth } from '../_utils/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      let tracker = await OfferTracker.findOne({ id: 1 });
      if (!tracker) {
        tracker = new OfferTracker({ id: 1, total_claimed: 0, claim_limit: 20 });
        await tracker.save();
      }
      return res.status(200).json(tracker);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      requireAuth(req);
      const { total_claimed, claim_limit } = req.body;
      
      const updateData: any = {};
      if (total_claimed !== undefined) updateData.total_claimed = total_claimed;
      if (claim_limit !== undefined) updateData.claim_limit = claim_limit;

      const tracker = await OfferTracker.findOneAndUpdate(
        { id: 1 },
        { $set: updateData },
        { new: true, upsert: true }
      );
      
      return res.status(200).json(tracker);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
