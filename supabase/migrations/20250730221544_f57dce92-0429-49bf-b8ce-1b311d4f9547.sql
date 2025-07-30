-- Add new address columns to company_details table
ALTER TABLE public.company_details 
ADD COLUMN street_address1 TEXT,
ADD COLUMN street_address2 TEXT,
ADD COLUMN city TEXT,
ADD COLUMN country TEXT,
ADD COLUMN zip TEXT;

-- Drop the old company_address column
ALTER TABLE public.company_details 
DROP COLUMN company_address;