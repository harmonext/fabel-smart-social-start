-- Change customer_gender from text to text array to support multi-select
ALTER TABLE public.marketing_onboarding 
ALTER COLUMN customer_gender TYPE text[] USING ARRAY[customer_gender];

-- Update the default value to be an empty array
ALTER TABLE public.marketing_onboarding 
ALTER COLUMN customer_gender SET DEFAULT '{}'::text[];