-- Create social_connections table to store user's social media connections
CREATE TABLE public.social_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'twitter', 'linkedin', 'pinterest', 'tiktok')),
  platform_user_id TEXT NOT NULL,
  account_name TEXT NOT NULL,
  followers_count INTEGER DEFAULT 0,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one connection per platform per user
  UNIQUE(user_id, platform)
);

-- Enable Row Level Security
ALTER TABLE public.social_connections ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own social connections" 
ON public.social_connections 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own social connections" 
ON public.social_connections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social connections" 
ON public.social_connections 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social connections" 
ON public.social_connections 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_social_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_social_connections_updated_at
BEFORE UPDATE ON public.social_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_social_connections_updated_at();