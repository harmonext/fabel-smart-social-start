-- Enable full CRUD operations for prompt_template_type table
-- Note: In production, these should be restricted to admin users only

-- Allow authenticated users to insert prompt template types
CREATE POLICY "Allow authenticated users to insert prompt template types" 
ON public.prompt_template_type 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow authenticated users to update prompt template types
CREATE POLICY "Allow authenticated users to update prompt template types" 
ON public.prompt_template_type 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Allow authenticated users to delete prompt template types
CREATE POLICY "Allow authenticated users to delete prompt template types" 
ON public.prompt_template_type 
FOR DELETE 
TO authenticated 
USING (true);