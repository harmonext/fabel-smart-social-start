-- Add current_step column to track user's progress in onboarding
ALTER TABLE public.marketing_onboarding
ADD COLUMN IF NOT EXISTS current_step TEXT DEFAULT 'about-you';

-- Add updated_at column to track last save time
ALTER TABLE public.marketing_onboarding
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_marketing_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_marketing_onboarding_updated_at_trigger ON public.marketing_onboarding;

CREATE TRIGGER update_marketing_onboarding_updated_at_trigger
  BEFORE UPDATE ON public.marketing_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION update_marketing_onboarding_updated_at();