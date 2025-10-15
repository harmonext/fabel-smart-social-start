-- Drop the existing SELECT policy that only shows active rules
DROP POLICY IF EXISTS "Anyone can view active platform rules" ON public.platform_rules;

-- Create new SELECT policies:
-- 1. Super admins can view all platform rules (active and inactive)
CREATE POLICY "Super admins can view all platform rules"
ON public.platform_rules
FOR SELECT
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- 2. Regular users can only view active platform rules
CREATE POLICY "Users can view active platform rules"
ON public.platform_rules
FOR SELECT
USING (is_active = true);