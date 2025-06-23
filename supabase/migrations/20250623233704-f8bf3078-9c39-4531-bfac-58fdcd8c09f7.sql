
-- Create a table for company details
CREATE TABLE public.company_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  company_name TEXT NOT NULL,
  company_industry TEXT NOT NULL,
  company_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.company_details ENABLE ROW LEVEL SECURITY;

-- Create policies for company details data
CREATE POLICY "Users can view their own company details" 
  ON public.company_details 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own company details" 
  ON public.company_details 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company details" 
  ON public.company_details 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create unique constraint to ensure one company details record per user
ALTER TABLE public.company_details 
ADD CONSTRAINT unique_user_company_details UNIQUE (user_id);
