-- Create platform_rules table to store social media platform content constraints
CREATE TABLE IF NOT EXISTS public.platform_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  rule_name TEXT NOT NULL,
  rule_value JSONB NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_customizable BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(platform, rule_type, rule_name)
);

-- Enable RLS
ALTER TABLE public.platform_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active platform rules"
ON public.platform_rules
FOR SELECT
USING (is_active = true);

CREATE POLICY "Super admins can insert platform rules"
ON public.platform_rules
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Super admins can update platform rules"
ON public.platform_rules
FOR UPDATE
USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Super admins can delete platform rules"
ON public.platform_rules
FOR DELETE
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_platform_rules_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE TRIGGER update_platform_rules_updated_at
BEFORE UPDATE ON public.platform_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_platform_rules_updated_at();

-- Insert default platform rules based on 2025 research
-- Instagram Rules
INSERT INTO public.platform_rules (platform, rule_type, rule_name, rule_value, description) VALUES
('instagram', 'text', 'caption_max_length', '{"value": 2200}', 'Maximum characters allowed in Instagram captions'),
('instagram', 'text', 'hashtag_max_count', '{"value": 30}', 'Maximum number of hashtags per post'),
('instagram', 'media', 'image_aspect_ratios', '{"values": ["1:1", "4:5", "1.91:1"]}', 'Supported aspect ratios for images (square, portrait, landscape)'),
('instagram', 'media', 'video_aspect_ratios', '{"values": ["9:16", "1:1", "4:5"]}', 'Supported aspect ratios for videos'),
('instagram', 'media', 'video_max_length', '{"value": 90, "unit": "seconds"}', 'Maximum video length for feed posts'),
('instagram', 'media', 'reel_max_length', '{"value": 90, "unit": "seconds"}', 'Maximum Reels video length'),
('instagram', 'posting', 'daily_post_limit', '{"value": 50}', 'Recommended maximum posts per day');

-- TikTok Rules
INSERT INTO public.platform_rules (platform, rule_type, rule_name, rule_value, description) VALUES
('tiktok', 'text', 'caption_max_length', '{"value": 2200}', 'Maximum characters in TikTok captions'),
('tiktok', 'text', 'hashtag_max_count', '{"value": 20}', 'Maximum hashtags per video'),
('tiktok', 'media', 'video_aspect_ratio', '{"value": "9:16"}', 'Required vertical aspect ratio'),
('tiktok', 'media', 'video_min_length', '{"value": 3, "unit": "seconds"}', 'Minimum video duration'),
('tiktok', 'media', 'video_max_length', '{"value": 600, "unit": "seconds"}', 'Maximum video duration (10 minutes)'),
('tiktok', 'media', 'video_max_size', '{"value": 287, "unit": "MB"}', 'Maximum video file size');

-- LinkedIn Rules
INSERT INTO public.platform_rules (platform, rule_type, rule_name, rule_value, description) VALUES
('linkedin', 'text', 'post_max_length', '{"value": 3000}', 'Maximum characters in LinkedIn posts'),
('linkedin', 'text', 'hashtag_max_count', '{"value": 3}', 'Recommended maximum hashtags for optimal reach'),
('linkedin', 'media', 'image_aspect_ratios', '{"values": ["1.91:1", "1:1"]}', 'Supported image aspect ratios'),
('linkedin', 'media', 'video_aspect_ratios', '{"values": ["16:9", "1:1", "9:16"]}', 'Supported video aspect ratios'),
('linkedin', 'media', 'video_max_length', '{"value": 600, "unit": "seconds"}', 'Maximum video length (10 minutes)'),
('linkedin', 'posting', 'daily_post_limit', '{"value": 5}', 'Recommended posts per day for best engagement');

-- Twitter/X Rules
INSERT INTO public.platform_rules (platform, rule_type, rule_name, rule_value, description) VALUES
('twitter', 'text', 'post_max_length', '{"value": 280}', 'Maximum characters per tweet'),
('twitter', 'text', 'premium_post_max_length', '{"value": 25000}', 'Maximum characters for Premium subscribers'),
('twitter', 'media', 'image_aspect_ratios', '{"values": ["16:9", "1:1", "4:5"]}', 'Supported image aspect ratios'),
('twitter', 'media', 'video_max_length', '{"value": 140, "unit": "seconds"}', 'Maximum video length for standard users'),
('twitter', 'media', 'premium_video_max_length', '{"value": 7200, "unit": "seconds"}', 'Maximum video length for Premium (2 hours)'),
('twitter', 'media', 'images_max_count', '{"value": 4}', 'Maximum images per tweet');

-- Facebook Rules
INSERT INTO public.platform_rules (platform, rule_type, rule_name, rule_value, description) VALUES
('facebook', 'text', 'post_max_length', '{"value": 63206}', 'Maximum characters in Facebook posts'),
('facebook', 'text', 'recommended_length', '{"value": 250}', 'Recommended post length for best engagement'),
('facebook', 'media', 'image_aspect_ratios', '{"values": ["16:9", "1:1", "4:5", "2:3"]}', 'Supported image aspect ratios'),
('facebook', 'media', 'video_aspect_ratios', '{"values": ["16:9", "9:16", "1:1", "4:5"]}', 'Supported video aspect ratios'),
('facebook', 'media', 'video_max_length', '{"value": 14400, "unit": "seconds"}', 'Maximum video length (240 minutes)'),
('facebook', 'posting', 'daily_post_limit', '{"value": 25}', 'Recommended maximum posts per day');

-- Pinterest Rules
INSERT INTO public.platform_rules (platform, rule_type, rule_name, rule_value, description) VALUES
('pinterest', 'text', 'pin_title_max_length', '{"value": 100}', 'Maximum characters in Pin title'),
('pinterest', 'text', 'description_max_length', '{"value": 500}', 'Maximum characters in Pin description'),
('pinterest', 'text', 'hashtag_max_count', '{"value": 20}', 'Maximum hashtags per Pin'),
('pinterest', 'media', 'image_aspect_ratio', '{"value": "2:3"}', 'Recommended aspect ratio (1000x1500px)'),
('pinterest', 'media', 'video_aspect_ratios', '{"values": ["1:1", "2:3", "9:16"]}', 'Supported video aspect ratios'),
('pinterest', 'media', 'video_max_length', '{"value": 900, "unit": "seconds"}', 'Maximum video length (15 minutes)'),
('pinterest', 'media', 'video_max_size', '{"value": 2000, "unit": "MB"}', 'Maximum video file size');