-- Add goal column to scheduled_content table
ALTER TABLE public.scheduled_content 
ADD COLUMN goal text;