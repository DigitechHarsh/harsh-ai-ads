-- Table for the Hero Banner Slider
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    cta_text TEXT DEFAULT 'Apply Now',
    cta_link TEXT DEFAULT '#form',
    media_url TEXT NOT NULL,
    media_type TEXT CHECK (media_type IN ('image', 'video')) DEFAULT 'image',
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Public Read
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Banners View" ON public.hero_banners FOR SELECT USING (true);

-- Admin Write (Bypass RLS for simplicity in our dashboard build)
CREATE POLICY "Public Banners Insert" ON public.hero_banners FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Banners Update" ON public.hero_banners FOR UPDATE USING (true);
CREATE POLICY "Public Banners Delete" ON public.hero_banners FOR DELETE USING (true);
