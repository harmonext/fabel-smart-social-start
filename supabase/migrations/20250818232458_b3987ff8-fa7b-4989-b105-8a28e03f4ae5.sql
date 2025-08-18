-- Drop the security definer view and recreate as a normal view
DROP VIEW IF EXISTS public.admin_content_moderation;

-- Create a normal view without SECURITY DEFINER
CREATE VIEW public.admin_content_moderation AS
SELECT 
  sc.*,
  cd.name as company_name,
  cd.industry as company_industry
FROM public.scheduled_content sc
LEFT JOIN public.company_details cd ON sc.user_id = cd.user_id
ORDER BY sc.created_at DESC;

-- Add RLS policy for super admins to access all content for moderation
CREATE POLICY "Super admins can view all content for moderation" 
ON public.scheduled_content 
FOR SELECT 
USING (has_role(auth.uid(), 'super_admin'::app_role));