-- Add onboarding_persona_prompt column to company_details table
ALTER TABLE public.company_details 
ADD COLUMN onboarding_persona_prompt TEXT;