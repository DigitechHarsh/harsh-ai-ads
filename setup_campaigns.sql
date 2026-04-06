-- Create table for Prompts Library Product covers
CREATE TABLE IF NOT EXISTS public.prompt_campaigns (
    brand_name TEXT PRIMARY KEY,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Public Read
ALTER TABLE public.prompt_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Campaigns View" ON public.prompt_campaigns FOR SELECT USING (true);

-- Admin Write (Bypass for now for easy Admin UI)
CREATE POLICY "Public Campaigns Insert" ON public.prompt_campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Campaigns Update" ON public.prompt_campaigns FOR UPDATE USING (true);
CREATE POLICY "Public Campaigns Delete" ON public.prompt_campaigns FOR DELETE USING (true);
