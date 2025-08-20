-- Create a secure function to get connection metadata without tokens
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

-- Create RLS policy to prevent direct access to tokens via SELECT
DROP POLICY IF EXISTS "Users can view their own social connections" ON public.social_connections;

CREATE POLICY "Users can view connection metadata only" 
ON public.social_connections 
FOR SELECT 
USING (false); -- Block direct SELECT access

-- Allow users to manage connections but not view tokens directly
CREATE POLICY "Users can update their own connections" 
ON public.social_connections 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own connections" 
ON public.social_connections 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own connections" 
ON public.social_connections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);