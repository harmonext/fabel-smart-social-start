-- Create prompt_template_type lookup table
CREATE TABLE public.prompt_template_type (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.prompt_template_type ENABLE ROW LEVEL SECURITY;

-- Create policy for readonly access for authenticated users
CREATE POLICY "Authenticated users can view prompt template types" 
ON public.prompt_template_type 
FOR SELECT 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_prompt_template_type_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Set an empty search path for security
  SET search_path = '';
  
  -- Update the updated_at timestamp
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_prompt_template_type_updated_at
BEFORE UPDATE ON public.prompt_template_type
FOR EACH ROW
EXECUTE FUNCTION public.update_prompt_template_type_updated_at();

-- Add foreign key constraint to system_prompt_template table
ALTER TABLE public.system_prompt_template 
ADD CONSTRAINT fk_system_prompt_template_type 
FOREIGN KEY (prompt_template_type_id) 
REFERENCES public.prompt_template_type(id);