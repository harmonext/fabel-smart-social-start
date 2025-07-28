-- Create storage bucket for media assets
INSERT INTO storage.buckets (id, name, public) VALUES ('scheduled-content-media', 'scheduled-content-media', true);

-- Add media_url column to scheduled_content table
ALTER TABLE public.scheduled_content ADD COLUMN media_url TEXT;

-- Create storage policies for media uploads
CREATE POLICY "Users can view their own media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'scheduled-content-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'scheduled-content-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own media" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'scheduled-content-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'scheduled-content-media' AND auth.uid()::text = (storage.foldername(name))[1]);