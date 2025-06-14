
-- Create storage bucket for campaign images
INSERT INTO storage.buckets (id, name, public)
VALUES ('campaign-images', 'campaign-images', true);

-- Create policy to allow authenticated users to upload campaign images
CREATE POLICY "Authenticated users can upload campaign images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'campaign-images');

-- Create policy to allow public read access to campaign images
CREATE POLICY "Public read access for campaign images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'campaign-images');

-- Create policy to allow users to update their own campaign images
CREATE POLICY "Users can update campaign images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'campaign-images');

-- Create policy to allow users to delete campaign images
CREATE POLICY "Users can delete campaign images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'campaign-images');
