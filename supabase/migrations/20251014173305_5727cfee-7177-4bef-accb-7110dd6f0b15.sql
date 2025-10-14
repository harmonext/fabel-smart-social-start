-- First, delete duplicate rows, keeping only the most recent one per user
DELETE FROM marketing_onboarding
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id
  FROM marketing_onboarding
  ORDER BY user_id, updated_at DESC
);

-- Add unique constraint on user_id to prevent future duplicates
ALTER TABLE marketing_onboarding
ADD CONSTRAINT marketing_onboarding_user_id_key UNIQUE (user_id);