-- 1. Create the Table
CREATE TABLE IF NOT EXISTS public.reel_prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    brand TEXT NOT NULL,
    image_prompt TEXT,
    negative_prompt TEXT,
    video_prompt TEXT,
    media_url TEXT,
    is_free BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Allow public to read the prompts (for the website)
ALTER TABLE public.reel_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Prompts View" ON public.reel_prompts FOR SELECT USING (true);

-- 3. Allow inserting/updating for now (so admin panel works easily without auth hurdles)
CREATE POLICY "Public Prompts Insert" ON public.reel_prompts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Prompts Update" ON public.reel_prompts FOR UPDATE USING (true);
CREATE POLICY "Public Prompts Delete" ON public.reel_prompts FOR DELETE USING (true);
