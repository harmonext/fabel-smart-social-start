-- Remove raw_persona_generated column from saved_personas table
ALTER TABLE public.saved_personas 
DROP COLUMN raw_persona_generated;