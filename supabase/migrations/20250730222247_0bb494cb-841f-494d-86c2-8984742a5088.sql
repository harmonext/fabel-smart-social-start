-- Add state column to company_details table
ALTER TABLE public.company_details 
ADD COLUMN state TEXT;