-- Change store_type column from text to text array to support multiple selections
ALTER TABLE public.marketing_onboarding 
ALTER COLUMN store_type TYPE text[] USING ARRAY[store_type];