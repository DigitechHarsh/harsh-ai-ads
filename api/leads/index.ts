import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../_utils/dbConnect';
import { ContactSubmission, OfferTracker } from '../_utils/models';
import { requireAuth } from '../_utils/auth';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      requireAuth(req);
      const leads = await ContactSubmission.find({}).sort({ created_at: -1 });
      return res.status(200).json(leads);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, brand_name, phone, email, product_type, product_images } = req.body;

      // Check offer eligibility
      let tracker = await OfferTracker.findOne({ id: 1 });
      if (!tracker) {
        tracker = new OfferTracker({ id: 1, total_claimed: 0, claim_limit: 20 });
        await tracker.save();
      }

      let is_offer_eligible = false;
      if (tracker.total_claimed < tracker.claim_limit) {
        is_offer_eligible = true;
        tracker.total_claimed += 1;
        await tracker.save();
      }

      const lead = new ContactSubmission({
        name,
        brand_name,
        phone,
        email,
        product_type,
        product_images,
        is_offer_eligible,
      });

      await lead.save();

      // Send email via Resend
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'Cinematic Ads <onboarding@resend.dev>', // Update to verified domain in production
          to: email,
          subject: 'Welcome to Cinematic AI Ads',
          html: `<p>Hi ${name},</p><p>Thanks for your submission! You are ${is_offer_eligible ? '' : 'not '}eligible for the offer.</p>`,
        });
      }

      return res.status(200).json({ success: true, isEligible: is_offer_eligible });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
