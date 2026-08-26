import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import { query } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod';
const resend = new Resend(process.env.RESEND_API_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Auth Helpers
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = decoded;
  next();
}

// ==========================================
// 🔐 AUTH ROUTES
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';

  if (email === adminEmail && password === adminPassword) {
    const token = signToken({ email, role: 'admin' });
    return res.status(200).json({ token, user: { email, role: 'admin' } });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

// ==========================================
// 📈 OFFERS ROUTES
// ==========================================
app.get('/api/offers', async (req, res) => {
  try {
    const trackers = await query('SELECT * FROM offer_trackers WHERE id = 1');
    if (trackers.length === 0) {
      // Seed default tracker
      await query(
        'INSERT INTO offer_trackers (id, total_claimed, claim_limit, floating_bubble_enabled, floating_bubble_text, floating_bubble_cta) VALUES (1, 0, 20, 0, ?, ?)',
        ['🔥 Special Offer! Only ₹399', 'Grab Now']
      );
      const newTrackers = await query('SELECT * FROM offer_trackers WHERE id = 1');
      return res.status(200).json(newTrackers[0]);
    }
    
    // Map floating_bubble_enabled to boolean for compatibility
    const tracker = trackers[0];
    tracker.floating_bubble_enabled = !!tracker.floating_bubble_enabled;
    return res.status(200).json(tracker);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/offers', requireAuth, async (req, res) => {
  try {
    const { total_claimed, claim_limit, floating_bubble_enabled, floating_bubble_text, floating_bubble_cta } = req.body;

    const fields = [];
    const values = [];

    if (total_claimed !== undefined) { fields.push('total_claimed = ?'); values.push(total_claimed); }
    if (claim_limit !== undefined) { fields.push('claim_limit = ?'); values.push(claim_limit); }
    if (floating_bubble_enabled !== undefined) { fields.push('floating_bubble_enabled = ?'); values.push(floating_bubble_enabled ? 1 : 0); }
    if (floating_bubble_text !== undefined) { fields.push('floating_bubble_text = ?'); values.push(floating_bubble_text); }
    if (floating_bubble_cta !== undefined) { fields.push('floating_bubble_cta = ?'); values.push(floating_bubble_cta); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(1); // For the WHERE clause id = 1
    await query(`UPDATE offer_trackers SET ${fields.join(', ')} WHERE id = ?`, values);

    const updated = await query('SELECT * FROM offer_trackers WHERE id = 1');
    const tracker = updated[0];
    tracker.floating_bubble_enabled = !!tracker.floating_bubble_enabled;

    return res.status(200).json(tracker);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 📝 LEADS (CONTACT SUBMISSIONS) ROUTES
// ==========================================
app.get('/api/leads', requireAuth, async (req, res) => {
  try {
    const leads = await query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
    // Parse JSON arrays for product_images
    const formattedLeads = leads.map((lead) => {
      lead.is_offer_eligible = !!lead.is_offer_eligible;
      try {
        lead.product_images = lead.product_images ? JSON.parse(lead.product_images) : [];
      } catch (e) {
        lead.product_images = [];
      }
      return lead;
    });
    return res.status(200).json(formattedLeads);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const { name, brand_name, phone, email, product_type, product_images } = req.body;

    // Fetch offer tracker state
    let tracker;
    const trackers = await query('SELECT * FROM offer_trackers WHERE id = 1');
    if (trackers.length === 0) {
      await query(
        'INSERT INTO offer_trackers (id, total_claimed, claim_limit) VALUES (1, 0, 20)'
      );
      tracker = { id: 1, total_claimed: 0, claim_limit: 20 };
    } else {
      tracker = trackers[0];
    }

    let is_offer_eligible = false;
    if (tracker.total_claimed < tracker.claim_limit) {
      is_offer_eligible = true;
      await query('UPDATE offer_trackers SET total_claimed = total_claimed + 1 WHERE id = 1');
    }

    const imagesJson = JSON.stringify(product_images || []);

    const result = await query(
      'INSERT INTO contact_submissions (name, brand_name, phone, email, product_type, product_images, is_offer_eligible) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, brand_name, phone, email, product_type, imagesJson, is_offer_eligible ? 1 : 0]
    );

    const insertId = result.insertId;

    // Send onboarding email if key exists
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'AI Ads <onboarding@resend.dev>', // Update to verified domain in production
          to: email,
          subject: 'Welcome to AI Ads',
          html: `<p>Hi ${name},</p><p>Thanks for your submission! You are ${is_offer_eligible ? '' : 'not '}eligible for the offer.</p>`,
        });
      } catch (mailError) {
        console.error('Failed to send email:', mailError);
      }
    }

    return res.status(200).json({ success: true, id: insertId, isEligible: is_offer_eligible });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 🎨 HERO BANNER ROUTES
// ==========================================
app.get('/api/hero', async (req, res) => {
  try {
    const banners = await query('SELECT * FROM hero_banners ORDER BY priority ASC, created_at DESC');
    const formatted = banners.map((b) => {
      b.is_offer = !!b.is_offer;
      return b;
    });
    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/hero', requireAuth, async (req, res) => {
  try {
    const { title, subtitle, cta_text, cta_link, media_type, media_url, is_offer, marquee_text, priority } = req.body;
    const result = await query(
      'INSERT INTO hero_banners (title, subtitle, cta_text, cta_link, media_type, media_url, is_offer, marquee_text, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, subtitle, cta_text || 'Get Started', cta_link || '#form', media_type || 'image', media_url, is_offer ? 1 : 0, marquee_text, priority || 0]
    );
    const newBanner = { id: result.insertId, title, subtitle, cta_text, cta_link, media_type, media_url, is_offer: !!is_offer, marquee_text, priority };
    return res.status(200).json(newBanner);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/hero', requireAuth, async (req, res) => {
  try {
    const { id } = req.query;
    const { title, subtitle, cta_text, cta_link, media_type, media_url, is_offer, marquee_text, priority } = req.body;

    const fields = [];
    const values = [];

    if (title !== undefined) { fields.push('title = ?'); values.push(title); }
    if (subtitle !== undefined) { fields.push('subtitle = ?'); values.push(subtitle); }
    if (cta_text !== undefined) { fields.push('cta_text = ?'); values.push(cta_text); }
    if (cta_link !== undefined) { fields.push('cta_link = ?'); values.push(cta_link); }
    if (media_type !== undefined) { fields.push('media_type = ?'); values.push(media_type); }
    if (media_url !== undefined) { fields.push('media_url = ?'); values.push(media_url); }
    if (is_offer !== undefined) { fields.push('is_offer = ?'); values.push(is_offer ? 1 : 0); }
    if (marquee_text !== undefined) { fields.push('marquee_text = ?'); values.push(marquee_text); }
    if (priority !== undefined) { fields.push('priority = ?'); values.push(priority); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    await query(`UPDATE hero_banners SET ${fields.join(', ')} WHERE id = ?`, values);

    const banners = await query('SELECT * FROM hero_banners WHERE id = ?', [id]);
    if (banners.length > 0) {
      banners[0].is_offer = !!banners[0].is_offer;
      return res.status(200).json(banners[0]);
    }
    return res.status(404).json({ error: 'Banner not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/api/hero', requireAuth, async (req, res) => {
  try {
    const { id } = req.query;
    await query('DELETE FROM hero_banners WHERE id = ?', [id]);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 📂 PORTFOLIO (SAMPLES) ROUTES
// ==========================================
app.get('/api/portfolio', async (req, res) => {
  try {
    const samples = await query('SELECT * FROM samples ORDER BY created_at DESC');
    return res.status(200).json(samples);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/portfolio', requireAuth, async (req, res) => {
  try {
    const { title, media_type, media_url } = req.body;
    const result = await query(
      'INSERT INTO samples (title, media_type, media_url) VALUES (?, ?, ?)',
      [title, media_type || 'image', media_url]
    );
    const newSample = { id: result.insertId, title, media_type, media_url };
    return res.status(200).json(newSample);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/portfolio', requireAuth, async (req, res) => {
  try {
    const { id } = req.query;
    const { title, media_type, media_url } = req.body;

    const fields = [];
    const values = [];

    if (title !== undefined) { fields.push('title = ?'); values.push(title); }
    if (media_type !== undefined) { fields.push('media_type = ?'); values.push(media_type); }
    if (media_url !== undefined) { fields.push('media_url = ?'); values.push(media_url); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    await query(`UPDATE samples SET ${fields.join(', ')} WHERE id = ?`, values);

    const samples = await query('SELECT * FROM samples WHERE id = ?', [id]);
    if (samples.length > 0) {
      return res.status(200).json(samples[0]);
    }
    return res.status(404).json({ error: 'Sample not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/api/portfolio', requireAuth, async (req, res) => {
  try {
    const { id } = req.query;
    await query('DELETE FROM samples WHERE id = ?', [id]);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 💡 CAMPAIGNS (PROMPT CAMPAIGNS) ROUTES
// ==========================================
app.get('/api/campaigns', async (req, res) => {
  try {
    const campaigns = await query('SELECT * FROM prompt_campaigns ORDER BY created_at DESC');
    return res.status(200).json(campaigns);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/campaigns', requireAuth, async (req, res) => {
  try {
    const { brand_name, image_url } = req.body;
    const result = await query(
      'INSERT INTO prompt_campaigns (brand_name, image_url) VALUES (?, ?)',
      [brand_name, image_url]
    );
    const newCampaign = { id: result.insertId, brand_name, image_url };
    return res.status(200).json(newCampaign);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/campaigns', requireAuth, async (req, res) => {
  try {
    const { id } = req.query;
    const { brand_name, image_url } = req.body;

    const fields = [];
    const values = [];

    if (brand_name !== undefined) { fields.push('brand_name = ?'); values.push(brand_name); }
    if (image_url !== undefined) { fields.push('image_url = ?'); values.push(image_url); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    await query(`UPDATE prompt_campaigns SET ${fields.join(', ')} WHERE id = ?`, values);

    const campaigns = await query('SELECT * FROM prompt_campaigns WHERE id = ?', [id]);
    if (campaigns.length > 0) {
      return res.status(200).json(campaigns[0]);
    }
    return res.status(404).json({ error: 'Campaign not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/api/campaigns', requireAuth, async (req, res) => {
  try {
    const { id } = req.query;
    await query('DELETE FROM prompt_campaigns WHERE id = ?', [id]);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 💡 REEL PROMPTS ROUTES
// ==========================================
app.get('/api/prompts', async (req, res) => {
  try {
    const prompts = await query('SELECT * FROM reel_prompts ORDER BY created_at DESC');
    const formatted = prompts.map((p) => {
      p.is_free = !!p.is_free;
      return p;
    });
    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/prompts', requireAuth, async (req, res) => {
  try {
    const { title, brand, image_prompt, negative_prompt, video_prompt, media_url, is_free } = req.body;
    const result = await query(
      'INSERT INTO reel_prompts (title, brand, image_prompt, negative_prompt, video_prompt, media_url, is_free) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, brand, image_prompt, negative_prompt, video_prompt, media_url, is_free ? 1 : 0]
    );
    const newPrompt = { id: result.insertId, title, brand, image_prompt, negative_prompt, video_prompt, media_url, is_free: !!is_free };
    return res.status(200).json(newPrompt);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/prompts', requireAuth, async (req, res) => {
  try {
    const { id } = req.query;
    const { title, brand, image_prompt, negative_prompt, video_prompt, media_url, is_free } = req.body;

    const fields = [];
    const values = [];

    if (title !== undefined) { fields.push('title = ?'); values.push(title); }
    if (brand !== undefined) { fields.push('brand = ?'); values.push(brand); }
    if (image_prompt !== undefined) { fields.push('image_prompt = ?'); values.push(image_prompt); }
    if (negative_prompt !== undefined) { fields.push('negative_prompt = ?'); values.push(negative_prompt); }
    if (video_prompt !== undefined) { fields.push('video_prompt = ?'); values.push(video_prompt); }
    if (media_url !== undefined) { fields.push('media_url = ?'); values.push(media_url); }
    if (is_free !== undefined) { fields.push('is_free = ?'); values.push(is_free ? 1 : 0); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    await query(`UPDATE reel_prompts SET ${fields.join(', ')} WHERE id = ?`, values);

    const prompts = await query('SELECT * FROM reel_prompts WHERE id = ?', [id]);
    if (prompts.length > 0) {
      prompts[0].is_free = !!prompts[0].is_free;
      return res.status(200).json(prompts[0]);
    }
    return res.status(404).json({ error: 'Prompt not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/api/prompts', requireAuth, async (req, res) => {
  try {
    const { id } = req.query;
    await query('DELETE FROM reel_prompts WHERE id = ?', [id]);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 📚 RESOURCES ROUTES
// ==========================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.get('/api/resources', async (req, res) => {
  try {
    const resources = await query('SELECT * FROM resources ORDER BY created_at DESC');
    return res.status(200).json(resources);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/resources', requireAuth, (req, res) => {
  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });
    
    try {
      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      if (!title) return res.status(400).json({ error: 'Title is required' });
      
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) return res.status(400).json({ error: 'PDF File is required' });

      const result = await cloudinary.uploader.upload(file.filepath, {
        resource_type: 'auto', 
        folder: 'resources'
      });
      
      const insertResult = await query(
        'INSERT INTO resources (title, file_url) VALUES (?, ?)',
        [title, result.secure_url]
      );
      
      const newResource = { id: insertResult.insertId, title, file_url: result.secure_url };
      return res.status(200).json(newResource);
    } catch (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }
  });
});

app.delete('/api/resources', requireAuth, async (req, res) => {
  try {
    const { id } = req.query;
    await query('DELETE FROM resources WHERE id = ?', [id]);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 🌐 FRONTEND STATIC SERVING & SPA FALLBACK
// ==========================================
// Serve static assets from 'dist' folder
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback all other GET requests to index.html (Client-Side routing)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not Found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
