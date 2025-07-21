-- Remove unused columns from saved_personas table
ALTER TABLE public.saved_personas 
DROP COLUMN demographics,
DROP COLUMN pain_points,
DROP COLUMN goals,
DROP COLUMN preferred_channels,
DROP COLUMN buying_motivation,
DROP COLUMN content_preferences;