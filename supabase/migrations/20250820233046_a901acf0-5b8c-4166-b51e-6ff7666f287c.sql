-- Revoke public execute on sensitive RPC functions
REVOKE EXECUTE ON FUNCTION public.get_user_social_connections FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.store_encrypted_social_connection FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_encrypted_social_token FROM PUBLIC;

-- Grant execute only to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_social_connections TO authenticated;
GRANT EXECUTE ON FUNCTION public.store_encrypted_social_connection TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_encrypted_social_token TO authenticated;

-- Create secure token rotation function
CREATE OR REPLACE FUNCTION public.rotate_social_connection_tokens(_connection_id uuid, _new_access_token text, _new_refresh_token text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Only allow users to rotate their own tokens
  UPDATE public.social_connections 
  SET 
    access_token = _new_access_token,
    refresh_token = COALESCE(_new_refresh_token, refresh_token),
    last_sync_at = NOW(),
    updated_at = NOW()
  WHERE id = _connection_id 
    AND user_id = auth.uid()
    AND is_active = true;
  
  RETURN FOUND;
END;
$$;

-- Grant execute to authenticated users only
GRANT EXECUTE ON FUNCTION public.rotate_social_connection_tokens TO authenticated;