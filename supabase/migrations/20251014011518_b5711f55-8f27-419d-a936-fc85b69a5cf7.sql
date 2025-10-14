-- Add company_description column to marketing_onboarding table
ALTER TABLE public.marketing_onboarding 
ADD COLUMN company_description text DEFAULT '';