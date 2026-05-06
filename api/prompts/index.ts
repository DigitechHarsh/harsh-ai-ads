import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../_utils/dbConnect';
import { ReelPrompt } from '../_utils/models';
import { requireAuth } from '../_utils/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const prompts = await ReelPrompt.find({}).sort({ created_at: -1 });
      return res.status(200).json(prompts);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      requireAuth(req);
      const data = req.body;
      const prompt = new ReelPrompt(data);
      await prompt.save();
      return res.status(200).json(prompt);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      requireAuth(req);
      const { id } = req.query;
      await ReelPrompt.findByIdAndDelete(id);
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
      const prompt = await ReelPrompt.findByIdAndUpdate(id, data, { new: true });
      return res.status(200).json(prompt);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
