-- Add income_range and pain_points columns to saved_personas table
ALTER TABLE public.saved_personas 
ADD COLUMN income_range text,
ADD COLUMN pain_points text;