-- Update the platform check constraint to include pinterest
ALTER TABLE public.scheduled_content 
DROP CONSTRAINT scheduled_content_platform_check;

ALTER TABLE public.scheduled_content 
ADD CONSTRAINT scheduled_content_platform_check 
CHECK (platform IN ('facebook', 'instagram', 'linkedin', 'twitter', 'pinterest'));