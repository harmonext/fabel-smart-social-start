import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DecryptTokenRequest {
  platform: string;
  tokenType: 'access' | 'refresh';
}

// Secure AES-GCM decryption function
const decryptToken = async (encryptedToken: string, encryptionKey: string): Promise<string> => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  // Decode the base64 encrypted data
  const combined = new Uint8Array(
    atob(encryptedToken)
      .split('')
      .map(char => char.charCodeAt(0))
  );
  
  // Extract salt, iv, and encrypted data
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const encrypted = combined.slice(28);
  
  // Derive the same key used for encryption
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(encryptionKey.padEnd(32, '0').slice(0, 32)),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
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
    ['decrypt']
  );
  
  // Decrypt the data
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    encrypted
  );
  
  return decoder.decode(decrypted);
};

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

    const requestData: DecryptTokenRequest = await req.json();
    console.log('Decrypt token request:', { platform: requestData.platform, tokenType: requestData.tokenType });

    // Get encryption key from environment
    const encryptionKey = Deno.env.get('SOCIAL_TOKENS_ENCRYPTION_KEY');
    if (!encryptionKey) {
      throw new Error('Encryption key not configured');
    }

    // Get the encrypted token from the database
    const { data: encryptedTokenData, error: tokenError } = await supabase
      .rpc('get_encrypted_social_token', { 
        _user_id: user.id,
        _platform: requestData.platform,
        _token_type: requestData.tokenType
      });

    if (tokenError || !encryptedTokenData) {
      console.error('Error fetching encrypted token:', tokenError);
      throw new Error('Failed to fetch encrypted token');
    }

    // Decrypt the token
    const decryptedToken = await decryptToken(encryptedTokenData, encryptionKey);

    console.log('Successfully decrypted token for user:', user.id, 'platform:', requestData.platform);

    return new Response(
      JSON.stringify({ token: decryptedToken }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Token decryption error:', error);
    
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