-- Enable Row Level Security on system_prompt_template table
ALTER TABLE public.system_prompt_template ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to system prompt templates
CREATE POLICY "Allow public read access to system prompt templates" 
ON public.system_prompt_template 
FOR SELECT 
USING (true);