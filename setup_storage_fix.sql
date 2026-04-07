-- Create the bucket if it doesn't exist, and make it public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public access to all read operations in the portfolio bucket
DROP POLICY IF EXISTS "Public Portfolio View" ON storage.objects;
CREATE POLICY "Public Portfolio View" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');

-- Allow unauthenticated uploads to the portfolio bucket
DROP POLICY IF EXISTS "Public Portfolio Upload" ON storage.objects;
CREATE POLICY "Public Portfolio Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio');

-- Allow updates
DROP POLICY IF EXISTS "Public Portfolio Update" ON storage.objects;
CREATE POLICY "Public Portfolio Update" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio');

-- Allow deletes
DROP POLICY IF EXISTS "Public Portfolio Delete" ON storage.objects;
CREATE POLICY "Public Portfolio Delete" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio');
