-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view their own templates and system templates" ON public.prompt_template;
DROP POLICY IF EXISTS "Users can create their own templates" ON public.prompt_template;
DROP POLICY IF EXISTS "Users can update their own templates" ON public.prompt_template;
DROP POLICY IF EXISTS "Users can delete their own templates" ON public.prompt_template;

-- Remove user_id column
ALTER TABLE public.prompt_template DROP COLUMN user_id;

-- Disable Row Level Security
ALTER TABLE public.prompt_template DISABLE ROW LEVEL SECURITY;