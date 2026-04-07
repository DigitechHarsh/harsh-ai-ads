-- We'll just completely recreate the policies fully open for upserts
DROP POLICY IF EXISTS "Public Campaigns Insert" ON public.prompt_campaigns;
DROP POLICY IF EXISTS "Public Campaigns Update" ON public.prompt_campaigns;
DROP POLICY IF EXISTS "Public Campaigns Delete" ON public.prompt_campaigns;

CREATE POLICY "Public Campaigns All" ON public.prompt_campaigns 
AS PERMISSIVE FOR ALL 
TO PUBLIC
USING (true) 
WITH CHECK (true);
