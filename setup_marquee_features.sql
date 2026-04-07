-- SQL Script for Offer Marquee Features
-- Run this in your Supabase SQL Editor

-- 1. Add new columns to hero_banners table
ALTER TABLE hero_banners 
ADD COLUMN IF NOT EXISTS is_offer BOOLEAN DEFAULT false;

ALTER TABLE hero_banners 
ADD COLUMN IF NOT EXISTS marquee_text TEXT;

-- 2. Revoke older read policy if needed and recreate to ensure all columns accessible
-- (Usually not needed if using 'select *', but good to refresh)
DROP POLICY IF EXISTS "Public read hero_banners" ON hero_banners;
CREATE POLICY "Public read hero_banners" 
ON hero_banners FOR SELECT 
USING (true);
