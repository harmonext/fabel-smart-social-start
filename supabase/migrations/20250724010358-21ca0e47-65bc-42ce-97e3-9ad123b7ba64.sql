-- Add template_type column to system_prompt_template table
ALTER TABLE public.system_prompt_template 
ADD COLUMN template_type TEXT;