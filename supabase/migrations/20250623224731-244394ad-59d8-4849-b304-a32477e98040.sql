
-- Create a table to store tenant onboarding responses
CREATE TABLE public.tenant_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  business_name_description TEXT NOT NULL,
  customer_profile TEXT NOT NULL,
  customer_problem TEXT NOT NULL,
  unique_selling_proposition TEXT NOT NULL,
  social_media_goals TEXT[] NOT NULL DEFAULT '{}',
  content_tone TEXT NOT NULL,
  preferred_platforms TEXT[] NOT NULL DEFAULT '{}',
  top_customer_questions TEXT NOT NULL,
  target_segments TEXT NOT NULL,
  customer_values TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.tenant_onboarding ENABLE ROW LEVEL SECURITY;

-- Create policies for tenant onboarding data
CREATE POLICY "Users can view their own onboarding data" 
  ON public.tenant_onboarding 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own onboarding data" 
  ON public.tenant_onboarding 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding data" 
  ON public.tenant_onboarding 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create unique constraint to ensure one onboarding record per user
ALTER TABLE public.tenant_onboarding 
ADD CONSTRAINT unique_user_onboarding UNIQUE (user_id);
