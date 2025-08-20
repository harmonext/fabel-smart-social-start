-- Fix the security definer function by adding search path protection
CREATE OR REPLACE FUNCTION public.get_user_social_connections(_user_id uuid)
RETURNS TABLE (
  id uuid,
  platform text,
  platform_user_id text,
  account_name text,
  followers_count integer,
  is_active boolean,
  connected_at timestamp with time zone,
  last_sync_at timestamp with time zone,
  token_expires_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT 
    sc.id,
    sc.platform,
    sc.platform_user_id,
    sc.account_name,
    sc.followers_count,
    sc.is_active,
    sc.connected_at,
    sc.last_sync_at,
    sc.token_expires_at
  FROM public.social_connections sc
  WHERE sc.user_id = _user_id
    AND sc.is_active = true;
$$;