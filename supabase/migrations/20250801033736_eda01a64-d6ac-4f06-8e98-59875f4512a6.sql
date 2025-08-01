-- Add is_active column to prompt_template_type table
ALTER TABLE public.prompt_template_type 
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- Create an index for better performance when filtering by status
CREATE INDEX idx_prompt_template_type_is_active ON public.prompt_template_type(is_active);