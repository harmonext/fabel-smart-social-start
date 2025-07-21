-- Add raw_persona_generated column to saved_personas table
ALTER TABLE public.saved_personas 
ADD COLUMN raw_persona_generated TEXT;