import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TokenManagerRequest {
  action: 'get' | 'store';
  platform?: string;
  tokenData?: {
    access_token: string;
    refresh_token?: string;
    platform_user_id: string;
    account_name: string;
    followers_count: number;
    token_expires_at?: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication token');
    }

    const requestData: TokenManagerRequest = await req.json();
    console.log('Token manager request:', { action: requestData.action, platform: requestData.platform });

    switch (requestData.action) {
      case 'get': {
        // Get user's social connections (without exposing actual tokens)
        const { data: connections, error: connectionsError } = await supabase
          .rpc('get_user_social_connections_safe', { _user_id: user.id });

        if (connectionsError) {
          console.error('Error fetching connections:', connectionsError);
          throw new Error('Failed to fetch social connections');
        }

        console.log('Retrieved connections for user:', user.id, 'count:', connections?.length || 0);

        return new Response(
          JSON.stringify({ connections: connections || [] }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }

      case 'store': {
        if (!requestData.platform || !requestData.tokenData) {
          throw new Error('Missing platform or token data');
        }

        // Get encryption key from environment
        const encryptionKey = Deno.env.get('SOCIAL_TOKENS_ENCRYPTION_KEY');
        if (!encryptionKey) {
          throw new Error('Encryption key not configured');
        }

        // Secure AES-GCM encryption
        const encryptToken = async (token: string): Promise<string> => {
          const encoder = new TextEncoder();
          const data = encoder.encode(token);
          
          // Derive a proper encryption key from the environment variable
          const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(encryptionKey.padEnd(32, '0').slice(0, 32)),
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
          );
          
          const salt = crypto.getRandomValues(new Uint8Array(16));
          const key = await crypto.subtle.deriveKey(
            {
              name: 'PBKDF2',
              salt: salt,
              iterations: 100000,
              hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt']
          );
          
          const iv = crypto.getRandomValues(new Uint8Array(12));
          const encrypted = await crypto.subtle.encrypt(
            {
              name: 'AES-GCM',
              iv: iv
            },
            key,
            data
          );
          
          // Combine salt, iv, and encrypted data
          const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
          combined.set(salt, 0);
          combined.set(iv, salt.length);
          combined.set(new Uint8Array(encrypted), salt.length + iv.length);
          
          return btoa(String.fromCharCode(...combined));
        };

        const encryptedAccessToken = await encryptToken(requestData.tokenData.access_token);
        const encryptedRefreshToken = requestData.tokenData.refresh_token 
          ? await encryptToken(requestData.tokenData.refresh_token) 
          : null;

        // Store encrypted tokens using the database function
        const { data: connectionId, error: storeError } = await supabase
          .rpc('store_encrypted_social_connection', {
            _user_id: user.id,
            _platform: requestData.platform,
            _platform_user_id: requestData.tokenData.platform_user_id,
            _account_name: requestData.tokenData.account_name,
            _encrypted_access_token: encryptedAccessToken,
            _encrypted_refresh_token: encryptedRefreshToken,
            _followers_count: requestData.tokenData.followers_count || 0,
            _token_expires_at: requestData.tokenData.token_expires_at || null
          });

        if (storeError) {
          console.error('Error storing connection:', storeError);
          throw new Error('Failed to store encrypted connection');
        }

        console.log('Stored encrypted connection for user:', user.id, 'platform:', requestData.platform);

        return new Response(
          JSON.stringify({ success: true, connectionId }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }

      default:
        throw new Error(`Unknown action: ${requestData.action}`);
    }

  } catch (error) {
    console.error('Token manager error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});