-- Rename category column to industry in marketing_onboarding table
ALTER TABLE public.marketing_onboarding 
RENAME COLUMN category TO industry;