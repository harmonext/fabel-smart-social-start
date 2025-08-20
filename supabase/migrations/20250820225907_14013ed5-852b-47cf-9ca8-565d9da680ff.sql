-- Security fixes migration

-- 1. Fix storage bucket policies for scheduled-content-media
-- First, ensure the bucket exists and is private
INSERT INTO storage.buckets (id, name, public) 
VALUES ('scheduled-content-media', 'scheduled-content-media', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Create proper RLS policies for scheduled-content-media bucket
-- Users can only access their own files
CREATE POLICY "Users can view their own scheduled content media"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'scheduled-content-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own scheduled content media"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'scheduled-content-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own scheduled content media"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'scheduled-content-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own scheduled content media"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'scheduled-content-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Super admins can access all files for moderation
CREATE POLICY "Super admins can access all scheduled content media"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'scheduled-content-media' 
  AND has_role(auth.uid(), 'super_admin'::app_role)
);

-- 2. Tighten system prompt template access
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow public read access to system prompt templates" ON public.system_prompt_template;

-- Create restricted policy - only authenticated users can read
CREATE POLICY "Authenticated users can read system prompt templates"
ON public.system_prompt_template
FOR SELECT
USING (auth.role() = 'authenticated');

-- 3. Fix social_connections policy to allow proper metadata access
-- Drop the restrictive policy that blocks all SELECT
DROP POLICY IF EXISTS "Users can view connection metadata only" ON public.social_connections;

-- Create proper policy for viewing own connections (without sensitive tokens)
CREATE POLICY "Users can view their own social connections metadata"
ON public.social_connections
FOR SELECT
USING (auth.uid() = user_id);

-- 4. Add validation trigger for social_connections token expiry
CREATE OR REPLACE FUNCTION public.validate_social_connection_expiry()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate that token_expires_at is in the future if provided
  IF NEW.token_expires_at IS NOT NULL AND NEW.token_expires_at <= NOW() THEN
    RAISE EXCEPTION 'Token expiry date must be in the future';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER validate_social_connection_expiry_trigger
  BEFORE INSERT OR UPDATE ON public.social_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_social_connection_expiry();