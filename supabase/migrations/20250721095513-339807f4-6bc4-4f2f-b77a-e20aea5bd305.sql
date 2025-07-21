
-- Change cac_estimate and ltv_estimate from numeric to text
ALTER TABLE public.saved_personas 
ALTER COLUMN cac_estimate TYPE TEXT,
ALTER COLUMN ltv_estimate TYPE TEXT;
