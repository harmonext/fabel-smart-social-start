-- Create scheduled_content table for managing social media posts
CREATE TABLE public.scheduled_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  platform TEXT NOT NULL CHECK (platform IN ('Facebook', 'Instagram', 'LinkedIn', 'Twitter')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  persona_name TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  engagement_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scheduled_content ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user access
CREATE POLICY "Users can view their own scheduled content" 
ON public.scheduled_content 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scheduled content" 
ON public.scheduled_content 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled content" 
ON public.scheduled_content 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled content" 
ON public.scheduled_content 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_scheduled_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_scheduled_content_updated_at
BEFORE UPDATE ON public.scheduled_content
FOR EACH ROW
EXECUTE FUNCTION public.update_scheduled_content_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_scheduled_content_user_id ON public.scheduled_content(user_id);
CREATE INDEX idx_scheduled_content_status ON public.scheduled_content(status);
CREATE INDEX idx_scheduled_content_scheduled_at ON public.scheduled_content(scheduled_at);
CREATE INDEX idx_scheduled_content_platform ON public.scheduled_content(platform);