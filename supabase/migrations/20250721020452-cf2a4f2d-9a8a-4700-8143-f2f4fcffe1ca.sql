-- Rename prompt_template table to system_prompt_template
ALTER TABLE public.prompt_template RENAME TO system_prompt_template;

-- Drop the existing trigger
DROP TRIGGER IF EXISTS update_prompt_template_updated_at ON public.system_prompt_template;

-- Create new trigger with correct table name
CREATE TRIGGER update_system_prompt_template_updated_at
BEFORE UPDATE ON public.system_prompt_template
FOR EACH ROW
EXECUTE FUNCTION public.update_marketing_onboarding_updated_at();