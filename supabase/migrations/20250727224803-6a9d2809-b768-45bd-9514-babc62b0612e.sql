-- Enable full CRUD access for system_prompt_template table
-- Note: In a production system, you'd want to restrict this to admin users only

-- Enable INSERT for authenticated users (temporary - should be admin-only in production)
CREATE POLICY "Allow authenticated users to insert system prompt templates"
ON public.system_prompt_template
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Enable UPDATE for authenticated users (temporary - should be admin-only in production)  
CREATE POLICY "Allow authenticated users to update system prompt templates"
ON public.system_prompt_template
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Enable DELETE for authenticated users (temporary - should be admin-only in production)
CREATE POLICY "Allow authenticated users to delete system prompt templates"
ON public.system_prompt_template
FOR DELETE
TO authenticated
USING (true);