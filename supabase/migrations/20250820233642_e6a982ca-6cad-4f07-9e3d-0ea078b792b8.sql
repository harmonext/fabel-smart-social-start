-- Add is_active columns for each social media platform in personas
ALTER TABLE public.saved_personas 
ADD COLUMN social_media_top_1_active boolean DEFAULT true,
ADD COLUMN social_media_top_2_active boolean DEFAULT true,
ADD COLUMN social_media_top_3_active boolean DEFAULT true;