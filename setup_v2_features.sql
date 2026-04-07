-- SQL Script for Cinematic AI Platform v2.0
-- Run this in your Supabase SQL Editor

-- 1. Create Hero Banners Table
CREATE TABLE IF NOT EXISTS hero_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_text TEXT DEFAULT 'Get Started',
  cta_link TEXT DEFAULT '#form',
  media_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image', -- 'image' or 'video'
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
-- Allow anyone to view banners
CREATE POLICY "Public read hero_banners" 
ON hero_banners FOR SELECT 
USING (true);

-- Allow authenticated admins to manage banners
CREATE POLICY "Admin full access hero_banners" 
ON hero_banners FOR ALL 
USING (auth.role() = 'authenticated');

-- 4. Ensure storage policies exist for the 'portfolio' bucket (for media uploads)
-- (This should already be there from previous fixes, but good to verify)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Admins can upload to portfolio'
    ) THEN
        CREATE POLICY "Admins can upload to portfolio" 
        ON storage.objects FOR INSERT 
        WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');
    END IF;
END $$;
