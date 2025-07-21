-- Add onboarded boolean column to company_details table
ALTER TABLE public.company_details 
ADD COLUMN onboarded BOOLEAN NOT NULL DEFAULT false;