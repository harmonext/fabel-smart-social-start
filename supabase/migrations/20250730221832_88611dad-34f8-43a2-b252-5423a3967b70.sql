-- Add phone_number column to company_details table
ALTER TABLE public.company_details 
ADD COLUMN phone_number TEXT;