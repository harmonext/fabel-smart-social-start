-- Add is_active column to system_prompt_template table
ALTER TABLE public.system_prompt_template 
ADD COLUMN is_active boolean NOT NULL DEFAULT true;

-- Add an index for better performance when filtering by active status
CREATE INDEX idx_system_prompt_template_is_active ON public.system_prompt_template(is_active);