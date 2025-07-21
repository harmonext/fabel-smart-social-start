-- Rename column appeal_howto to appeal_how_to in saved_personas table
ALTER TABLE public.saved_personas 
RENAME COLUMN appeal_howto TO appeal_how_to;