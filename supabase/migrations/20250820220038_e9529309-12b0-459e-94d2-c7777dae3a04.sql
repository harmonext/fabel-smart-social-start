-- Fix RLS policies for system tables to restrict write access to admins only

-- Remove existing overly permissive policies on system_prompt_template
DROP POLICY IF EXISTS "Allow authenticated users to insert system prompt templates" ON public.system_prompt_template;
DROP POLICY IF EXISTS "Allow authenticated users to update system prompt templates" ON public.system_prompt_template;
DROP POLICY IF EXISTS "Allow authenticated users to delete system prompt templates" ON public.system_prompt_template;

-- Remove existing overly permissive policies on prompt_template_type
DROP POLICY IF EXISTS "Allow authenticated users to insert prompt template types" ON public.prompt_template_type;
DROP POLICY IF EXISTS "Allow authenticated users to update prompt template types" ON public.prompt_template_type;
DROP POLICY IF EXISTS "Allow authenticated users to delete prompt template types" ON public.prompt_template_type;

-- Create admin-only policies for system_prompt_template
CREATE POLICY "Only admins can insert system prompt templates" 
ON public.system_prompt_template 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Only admins can update system prompt templates" 
ON public.system_prompt_template 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Only admins can delete system prompt templates" 
ON public.system_prompt_template 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create admin-only policies for prompt_template_type
CREATE POLICY "Only admins can insert prompt template types" 
ON public.prompt_template_type 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Only admins can update prompt template types" 
ON public.prompt_template_type 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Only admins can delete prompt template types" 
ON public.prompt_template_type 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Update storage bucket to be private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'scheduled-content-media';