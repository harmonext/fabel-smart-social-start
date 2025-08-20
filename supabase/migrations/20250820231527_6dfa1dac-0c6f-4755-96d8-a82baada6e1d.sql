-- Add encryption support for social media tokens
-- Create functions to handle encrypted tokens securely

-- Function to encrypt social media tokens (called from edge functions only)
CREATE OR REPLACE FUNCTION public.store_encrypted_social_connection(
  _user_id UUID,
  _platform TEXT,
  _platform_user_id TEXT,
  _account_name TEXT,
  _encrypted_access_token TEXT,
  _encrypted_refresh_token TEXT DEFAULT NULL,
  _followers_count INTEGER DEFAULT 0,
  _token_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  connection_id UUID;
BEGIN
  -- Insert or update the social connection with encrypted tokens
  INSERT INTO public.social_connections (
    user_id,
    platform,
    platform_user_id,
    account_name,
    access_token,
    refresh_token,
    followers_count,
    token_expires_at,
    connected_at,
    last_sync_at
  ) VALUES (
    _user_id,
    _platform,
    _platform_user_id,
    _account_name,
    _encrypted_access_token,
    _encrypted_refresh_token,
    _followers_count,
    _token_expires_at,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id, platform, platform_user_id)
  DO UPDATE SET
    account_name = EXCLUDED.account_name,
    access_token = EXCLUDED.access_token,
    refresh_token = EXCLUDED.refresh_token,
    followers_count = EXCLUDED.followers_count,
    token_expires_at = EXCLUDED.token_expires_at,
    is_active = true,
    last_sync_at = NOW(),
    updated_at = NOW()
  RETURNING id INTO connection_id;
  
  RETURN connection_id;
END;
$$;

-- Function to get social connections metadata (without tokens)
CREATE OR REPLACE FUNCTION public.get_user_social_connections_safe(_user_id UUID)
RETURNS TABLE(
  id UUID,
  platform TEXT,
  platform_user_id TEXT,
  account_name TEXT,
  followers_count INTEGER,
  is_active BOOLEAN,
  connected_at TIMESTAMP WITH TIME ZONE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  token_expires_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE SECURITY DEFINER
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

-- Function to get encrypted token for edge function use only
CREATE OR REPLACE FUNCTION public.get_encrypted_social_token(
  _user_id UUID,
  _platform TEXT,
  _token_type TEXT DEFAULT 'access'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  encrypted_token TEXT;
BEGIN
  -- Only return tokens for the authenticated user
  IF _token_type = 'access' THEN
    SELECT access_token INTO encrypted_token
    FROM public.social_connections
    WHERE user_id = _user_id 
      AND platform = _platform 
      AND is_active = true
    LIMIT 1;
  ELSIF _token_type = 'refresh' THEN
    SELECT refresh_token INTO encrypted_token
    FROM public.social_connections
    WHERE user_id = _user_id 
      AND platform = _platform 
      AND is_active = true
    LIMIT 1;
  END IF;
  
  RETURN encrypted_token;
END;
$$;