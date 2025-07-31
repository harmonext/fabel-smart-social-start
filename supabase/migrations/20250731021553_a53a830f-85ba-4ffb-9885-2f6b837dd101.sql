-- Rename columns in company_details table
ALTER TABLE public.company_details 
RENAME COLUMN company_industry TO industry;

ALTER TABLE public.company_details 
RENAME COLUMN company_name TO name;