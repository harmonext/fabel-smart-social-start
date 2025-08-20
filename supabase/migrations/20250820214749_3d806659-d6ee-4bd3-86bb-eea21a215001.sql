-- Enable RLS on the admin_content_moderation view
ALTER VIEW public.admin_content_moderation SET (security_barrier = true);

-- Grant usage to authenticated users (needed for RLS to work on views)
GRANT SELECT ON public.admin_content_moderation TO authenticated;

-- Create RLS policy for admin content moderation view
-- Only super admins can access this sensitive moderation data
CREATE POLICY "Super admins can view all content moderation data" 
ON public.admin_content_moderation 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Also ensure admins can access it (not just super admins)
CREATE POLICY "Admins can view all content moderation data" 
ON public.admin_content_moderation 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));