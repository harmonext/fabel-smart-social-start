-- Fix search path security issue for the new function
CREATE OR REPLACE FUNCTION public.update_prompt_template_type_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Set an empty search path for security
  SET search_path = '';
  
  -- Update the updated_at timestamp
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Also fix the existing functions that have the same security issue
CREATE OR REPLACE FUNCTION public.update_scheduled_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Set an empty search path for security
  SET search_path = '';
  
  -- Update the updated_at timestamp
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION public.update_marketing_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Set an empty search path for security
  SET search_path = '';
  
  -- Update the updated_at timestamp
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';