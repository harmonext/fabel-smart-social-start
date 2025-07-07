-- Create table for the new marketing onboarding form
CREATE TABLE public.marketing_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Tab 1: About You
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  
  -- Tab 2: About Your Company
  company_name TEXT NOT NULL,
  category TEXT NOT NULL,
  stage TEXT NOT NULL,
  product_types TEXT[] NOT NULL DEFAULT '{}',
  store_type TEXT NOT NULL,
  monthly_revenue TEXT NOT NULL,
  
  -- Tab 3: About Your Goals
  goals TEXT[] NOT NULL DEFAULT '{}',
  
  -- Tab 4: About Your Customer
  customer_gender TEXT NOT NULL,
  customer_age_ranges TEXT[] NOT NULL DEFAULT '{}',
  customer_income_ranges TEXT[] NOT NULL DEFAULT '{}'
);

-- Enable Row Level Security
ALTER TABLE public.marketing_onboarding ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own marketing onboarding" 
ON public.marketing_onboarding 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own marketing onboarding" 
ON public.marketing_onboarding 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own marketing onboarding" 
ON public.marketing_onboarding 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_marketing_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_marketing_onboarding_updated_at
BEFORE UPDATE ON public.marketing_onboarding
FOR EACH ROW
EXECUTE FUNCTION public.update_marketing_onboarding_updated_at();