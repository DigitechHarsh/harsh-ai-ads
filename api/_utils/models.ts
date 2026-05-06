import mongoose from 'mongoose';

const ContactSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand_name: { type: String },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  product_type: { type: String },
  product_images: [{ type: String }],
  is_offer_eligible: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

export const ContactSubmission = mongoose.models.ContactSubmission || mongoose.model('ContactSubmission', ContactSubmissionSchema);

const HeroBannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  cta_text: { type: String, default: 'Get Started' },
  cta_link: { type: String, default: '#form' },
  media_type: { type: String, default: 'image' },
  media_url: { type: String, required: true },
  is_offer: { type: Boolean, default: false },
  marquee_text: { type: String },
  priority: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

export const HeroBanner = mongoose.models.HeroBanner || mongoose.model('HeroBanner', HeroBannerSchema);

const PromptCampaignSchema = new mongoose.Schema({
  brand_name: { type: String, required: true },
  image_url: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export const PromptCampaign = mongoose.models.PromptCampaign || mongoose.model('PromptCampaign', PromptCampaignSchema);

const ReelPromptSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  image_prompt: { type: String },
  negative_prompt: { type: String },
  video_prompt: { type: String },
  media_url: { type: String },
  is_free: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

export const ReelPrompt = mongoose.models.ReelPrompt || mongoose.model('ReelPrompt', ReelPromptSchema);

const SampleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  media_type: { type: String, default: 'image' },
  media_url: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export const Sample = mongoose.models.Sample || mongoose.model('Sample', SampleSchema);

const OfferTrackerSchema = new mongoose.Schema({
  id: { type: Number, default: 1 },
  total_claimed: { type: Number, default: 0 },
  claim_limit: { type: Number, default: 20 },
});

export const OfferTracker = mongoose.models.OfferTracker || mongoose.model('OfferTracker', OfferTrackerSchema);
