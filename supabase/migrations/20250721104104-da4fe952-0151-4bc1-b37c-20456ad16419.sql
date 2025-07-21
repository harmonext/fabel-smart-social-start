-- Update onboarded flag for users who have completed marketing onboarding
UPDATE company_details 
SET onboarded = true 
WHERE user_id IN (
  SELECT DISTINCT user_id 
  FROM marketing_onboarding
) AND onboarded = false;