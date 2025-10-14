-- Add column to track the current active tab in marketing onboarding
ALTER TABLE public.marketing_onboarding
ADD COLUMN IF NOT EXISTS current_tab text DEFAULT 'about-you';

-- Add comment to explain the column
COMMENT ON COLUMN public.marketing_onboarding.current_tab IS 'Tracks which tab the user was on when they last saved their progress';