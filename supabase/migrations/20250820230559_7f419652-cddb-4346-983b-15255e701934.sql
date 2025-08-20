-- Fix function search path mutable warning
-- Add SET search_path to existing functions that are missing it

-- Fix the validate_social_connection_expiry function
CREATE OR REPLACE FUNCTION public.validate_social_connection_expiry()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Validate that token_expires_at is in the future if provided
  IF NEW.token_expires_at IS NOT NULL AND NEW.token_expires_at <= NOW() THEN
    RAISE EXCEPTION 'Token expiry date must be in the future';
  END IF;
  
  RETURN NEW;
END;
$$;