import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TokenRequest {
  action: 'store' | 'get' | 'decrypt_for_use'
  platform: string
  tokenData?: {
    access_token: string
    refresh_token?: string
    platform_user_id: string
    account_name: string
    followers_count?: number
    token_expires_at?: string
  }
  token_type?: 'access' | 'refresh'
}

// AES-256-GCM encryption functions
async function getEncryptionKey(): Promise<CryptoKey> {
  const keyString = Deno.env.get('SOCIAL_TOKENS_ENCRYPTION_KEY')
  if (!keyString) {
    throw new Error('Encryption key not configured')
  }
  
  const keyData = new TextEncoder().encode(keyString.substring(0, 32)) // Ensure 32 bytes
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  )
}

async function encryptToken(token: string): Promise<string> {
  if (!token) return ''
  
  const key = await getEncryptionKey()
  const iv = crypto.getRandomValues(new Uint8Array(12)) // 96-bit IV for GCM
  const encodedToken = new TextEncoder().encode(token)
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedToken
  )
  
  // Combine IV and encrypted data, then base64 encode
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(encrypted), iv.length)
  
  return btoa(String.fromCharCode(...combined))
}

async function decryptToken(encryptedToken: string): Promise<string> {
  if (!encryptedToken) return ''
  
  try {
    const key = await getEncryptionKey()
    const combined = new Uint8Array(atob(encryptedToken).split('').map(c => c.charCodeAt(0)))
    
    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    )
    
    return new TextDecoder().decode(decrypted)
  } catch (error) {
    console.error('Token decryption failed:', error)
    throw new Error('Failed to decrypt token')
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get the JWT token from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the user's JWT token
    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const requestBody: TokenRequest = await req.json()
    const { action, platform, tokenData, token_type = 'access' } = requestBody

    switch (action) {
      case 'store': {
        if (!tokenData) {
          return new Response(
            JSON.stringify({ error: 'Token data required for store action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Encrypt the tokens
        const encryptedAccessToken = await encryptToken(tokenData.access_token)
        const encryptedRefreshToken = tokenData.refresh_token ? 
          await encryptToken(tokenData.refresh_token) : null

        // Store encrypted tokens in database
        const { data, error } = await supabase.rpc('store_encrypted_social_connection', {
          _user_id: user.id,
          _platform: platform,
          _platform_user_id: tokenData.platform_user_id,
          _account_name: tokenData.account_name,
          _encrypted_access_token: encryptedAccessToken,
          _encrypted_refresh_token: encryptedRefreshToken,
          _followers_count: tokenData.followers_count || 0,
          _token_expires_at: tokenData.token_expires_at || null
        })

        if (error) {
          console.error('Database error:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to store connection' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, connection_id: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'decrypt_for_use': {
        // Get encrypted token from database
        const { data: encryptedToken, error } = await supabase.rpc('get_encrypted_social_token', {
          _user_id: user.id,
          _platform: platform,
          _token_type: token_type
        })

        if (error || !encryptedToken) {
          return new Response(
            JSON.stringify({ error: 'Token not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Decrypt the token
        const decryptedToken = await decryptToken(encryptedToken)

        return new Response(
          JSON.stringify({ token: decryptedToken }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get': {
        // Return connection metadata without tokens
        const { data, error } = await supabase.rpc('get_user_social_connections_safe', {
          _user_id: user.id
        })

        if (error) {
          console.error('Database error:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to fetch connections' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ connections: data || [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Secure token manager error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})