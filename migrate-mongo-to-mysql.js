import mongoose from 'mongoose';
import { query } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in your environment variables.');
  process.exit(1);
}

// Define MongoDB Schemas for migration
const ContactSubmissionSchema = new mongoose.Schema({}, { strict: false });
const ContactSubmission = mongoose.model('ContactSubmission', ContactSubmissionSchema, 'contactsubmissions');

const HeroBannerSchema = new mongoose.Schema({}, { strict: false });
const HeroBanner = mongoose.model('HeroBanner', HeroBannerSchema, 'herobanners');

const PromptCampaignSchema = new mongoose.Schema({}, { strict: false });
const PromptCampaign = mongoose.model('PromptCampaign', PromptCampaignSchema, 'promptcampaigns');

const ReelPromptSchema = new mongoose.Schema({}, { strict: false });
const ReelPrompt = mongoose.model('ReelPrompt', ReelPromptSchema, 'reelprompts');

const SampleSchema = new mongoose.Schema({}, { strict: false });
const Sample = mongoose.model('Sample', SampleSchema, 'samples');

const OfferTrackerSchema = new mongoose.Schema({}, { strict: false });
const OfferTracker = mongoose.model('OfferTracker', OfferTrackerSchema, 'offertrackers');

async function runMigration() {
  console.log('🚀 Starting Database Migration: MongoDB Atlas ➡️ MySQL...');

  try {
    // 1. Connect to MongoDB Atlas
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas.');

    // 2. Migrate OfferTracker
    console.log('⏳ Migrating OfferTracker...');
    const mongoOffers = await OfferTracker.find({});
    for (const offer of mongoOffers) {
      const doc = offer.toObject();
      await query(
        `INSERT INTO offer_trackers (id, total_claimed, claim_limit, floating_bubble_enabled, floating_bubble_text, floating_bubble_cta)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           total_claimed = VALUES(total_claimed), 
           claim_limit = VALUES(claim_limit), 
           floating_bubble_enabled = VALUES(floating_bubble_enabled), 
           floating_bubble_text = VALUES(floating_bubble_text), 
           floating_bubble_cta = VALUES(floating_bubble_cta)`,
        [
          doc.id || 1,
          doc.total_claimed || 0,
          doc.claim_limit || 20,
          doc.floating_bubble_enabled ? 1 : 0,
          doc.floating_bubble_text || '🔥 Special Offer! Only ₹399',
          doc.floating_bubble_cta || 'Grab Now',
        ]
      );
    }
    console.log(`✅ Migrated ${mongoOffers.length} OfferTracker record(s).`);

    // 3. Migrate ContactSubmissions
    console.log('⏳ Migrating ContactSubmissions...');
    const mongoLeads = await ContactSubmission.find({});
    let leadsCount = 0;
    for (const lead of mongoLeads) {
      const doc = lead.toObject();
      const imagesJson = JSON.stringify(doc.product_images || []);
      
      await query(
        `INSERT INTO contact_submissions (name, brand_name, phone, email, product_type, product_images, is_offer_eligible, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          doc.name,
          doc.brand_name || null,
          doc.phone,
          doc.email,
          doc.product_type || null,
          imagesJson,
          doc.is_offer_eligible ? 1 : 0,
          doc.created_at || new Date(),
        ]
      );
      leadsCount++;
    }
    console.log(`✅ Migrated ${leadsCount} Lead(s).`);

    // 4. Migrate HeroBanners
    console.log('⏳ Migrating HeroBanners...');
    const mongoBanners = await HeroBanner.find({});
    let bannersCount = 0;
    for (const banner of mongoBanners) {
      const doc = banner.toObject();
      await query(
        `INSERT INTO hero_banners (title, subtitle, cta_text, cta_link, media_type, media_url, is_offer, marquee_text, priority, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          doc.title,
          doc.subtitle || null,
          doc.cta_text || 'Get Started',
          doc.cta_link || '#form',
          doc.media_type || 'image',
          doc.media_url,
          doc.is_offer ? 1 : 0,
          doc.marquee_text || null,
          doc.priority || 0,
          doc.created_at || new Date(),
        ]
      );
      bannersCount++;
    }
    console.log(`✅ Migrated ${bannersCount} Hero Banner(s).`);

    // 5. Migrate PromptCampaigns
    console.log('⏳ Migrating PromptCampaigns...');
    const mongoCampaigns = await PromptCampaign.find({});
    let campaignsCount = 0;
    for (const campaign of mongoCampaigns) {
      const doc = campaign.toObject();
      await query(
        `INSERT INTO prompt_campaigns (brand_name, image_url, created_at)
         VALUES (?, ?, ?)`,
        [
          doc.brand_name,
          doc.image_url,
          doc.created_at || new Date(),
        ]
      );
      campaignsCount++;
    }
    console.log(`✅ Migrated ${campaignsCount} Campaign(s).`);

    // 6. Migrate ReelPrompts
    console.log('⏳ Migrating ReelPrompts...');
    const mongoPrompts = await ReelPrompt.find({});
    let promptsCount = 0;
    for (const prompt of mongoPrompts) {
      const doc = prompt.toObject();
      await query(
        `INSERT INTO reel_prompts (title, brand, image_prompt, negative_prompt, video_prompt, media_url, is_free, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          doc.title,
          doc.brand,
          doc.image_prompt || null,
          doc.negative_prompt || null,
          doc.video_prompt || null,
          doc.media_url || null,
          doc.is_free !== false ? 1 : 0,
          doc.created_at || new Date(),
        ]
      );
      promptsCount++;
    }
    console.log(`✅ Migrated ${promptsCount} Reel Prompt(s).`);

    // 7. Migrate Samples
    console.log('⏳ Migrating Samples...');
    const mongoSamples = await Sample.find({});
    let samplesCount = 0;
    for (const sample of mongoSamples) {
      const doc = sample.toObject();
      await query(
        `INSERT INTO samples (title, media_type, media_url, created_at)
         VALUES (?, ?, ?, ?)`,
        [
          doc.title,
          doc.media_type || 'image',
          doc.media_url,
          doc.created_at || new Date(),
        ]
      );
      samplesCount++;
    }
    console.log(`✅ Migrated ${samplesCount} Portfolio Sample(s).`);

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runMigration();
