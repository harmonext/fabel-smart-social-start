-- Remove company_name, stage, and monthly_revenue columns from marketing_onboarding table
ALTER TABLE public.marketing_onboarding 
DROP COLUMN company_name,
DROP COLUMN stage,
DROP COLUMN monthly_revenue;