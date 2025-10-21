-- Fix security warning by setting search_path in function
CREATE OR REPLACE FUNCTION update_marketing_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Set an empty search path for security
  SET search_path = '';
  
  -- Update the updated_at timestamp
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';