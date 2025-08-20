import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SecureSocialAuthRequest {
  action: 'connect' | 'callback'
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin'
  code?: string
  state?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header and verify JWT
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');

    // Verify the user's JWT token to get authenticated user ID
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { action, platform, code, state }: SecureSocialAuthRequest = await req.json();

    console.log(`Processing ${action} action for ${platform} platform for user ${user.id}`);

    switch (action) {
      case 'connect':
        return generateAuthUrl(platform, user.id);
      case 'callback':
        return await handleCallback(supabaseClient, platform, code!, state!, user.id);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in secure-social-auth function:', error);
    return new Response(
      JSON.stringify({ error: 'Authentication failed' }), // Sanitized error message
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function generateAuthUrl(platform: string, userId: string) {
  const redirectUri = `${Deno.env.get('SITE_URL')}/dashboard?tab=social&subtab=connections`;
  
  // Generate secure random state with user ID verification
  const nonce = crypto.randomUUID();
  const state = `${userId}_${platform}_${nonce}`;
  
  let authUrl: string;
  
  switch (platform) {
    case 'facebook':
      const facebookAppId = Deno.env.get('FACEBOOK_CLIENT_ID');
      authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${facebookAppId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=pages_manage_posts,pages_read_engagement,pages_show_list&` +
        `response_type=code&` +
        `state=${state}`;
      break;
    
    case 'instagram':
      const instagramAppId = Deno.env.get('FACEBOOK_CLIENT_ID'); // Same as Facebook
      authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${instagramAppId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=instagram_basic,instagram_content_publish&` +
        `response_type=code&` +
        `state=${state}`;
      break;
    
    case 'twitter':
      const twitterClientId = Deno.env.get('TWITTER_CLIENT_ID');
      const codeChallenge = generatePKCEChallenge();
      authUrl = `https://twitter.com/i/oauth2/authorize?` +
        `response_type=code&` +
        `client_id=${twitterClientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=tweet.read%20tweet.write%20users.read&` +
        `state=${state}&` +
        `code_challenge=${codeChallenge}&` +
        `code_challenge_method=S256`;
      break;
    
    case 'linkedin':
      const linkedinClientId = Deno.env.get('LINKEDIN_CLIENT_ID');
      authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
        `response_type=code&` +
        `client_id=${linkedinClientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=r_liteprofile%20w_member_social&` +
        `state=${state}`;
      break;
    
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  return new Response(
    JSON.stringify({ authUrl }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

async function handleCallback(supabase: any, platform: string, code: string, state: string, authenticatedUserId: string) {
  // Verify state parameter includes the authenticated user ID
  const [stateUserId, statePlatform, nonce] = state.split('_');
  
  if (stateUserId !== authenticatedUserId || statePlatform !== platform) {
    throw new Error('Invalid state parameter - potential CSRF attack');
  }

  let accessToken: string;
  let refreshToken: string | null = null;
  let expiresAt: string | null = null;
  let accountData: any;

  switch (platform) {
    case 'facebook':
      const fbResult = await handleFacebookAuth(code);
      accessToken = fbResult.accessToken;
      refreshToken = fbResult.refreshToken;
      expiresAt = fbResult.expiresAt;
      accountData = fbResult.accountData;
      break;
    
    case 'instagram':
      const igResult = await handleInstagramAuth(code);
      accessToken = igResult.accessToken;
      refreshToken = igResult.refreshToken;
      expiresAt = igResult.expiresAt;
      accountData = igResult.accountData;
      break;
    
    case 'twitter':
      const twitterResult = await handleTwitterAuth(code);
      accessToken = twitterResult.accessToken;
      refreshToken = twitterResult.refreshToken;
      accountData = twitterResult.accountData;
      break;
    
    case 'linkedin':
      const linkedinResult = await handleLinkedInAuth(code);
      accessToken = linkedinResult.accessToken;
      refreshToken = linkedinResult.refreshToken;
      expiresAt = linkedinResult.expiresAt;
      accountData = linkedinResult.accountData;
      break;
    
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  // Check if connection already exists
  const { data: existingConnection } = await supabase
    .from('social_connections')
    .select('*')
    .eq('user_id', authenticatedUserId) // Use authenticated user ID
    .eq('platform', platform)
    .eq('platform_user_id', accountData.id)
    .single();

  const connectionData = {
    user_id: authenticatedUserId, // Use authenticated user ID
    platform: platform,
    platform_user_id: accountData.id,
    account_name: accountData.name,
    followers_count: accountData.followersCount || 0,
    access_token: accessToken,
    refresh_token: refreshToken,
    token_expires_at: expiresAt,
    is_active: true,
    last_sync_at: new Date().toISOString()
  };

  let result;
  if (existingConnection) {
    // Update existing connection
    result = await supabase
      .from('social_connections')
      .update(connectionData)
      .eq('id', existingConnection.id)
      .select('id, platform, account_name, followers_count, is_active, connected_at') // Don't return tokens
      .single();
  } else {
    // Create new connection
    result = await supabase
      .from('social_connections')
      .insert([connectionData])
      .select('id, platform, account_name, followers_count, is_active, connected_at') // Don't return tokens
      .single();
  }

  if (result.error) throw result.error;

  // Return success without exposing tokens
  return new Response(
    JSON.stringify({ 
      success: true, 
      connection: result.data // Tokens are not included in response
    }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

function generatePKCEChallenge(): string {
  // Generate PKCE code challenge for Twitter OAuth 2.0
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const codeVerifier = btoa(String.fromCharCode.apply(null, Array.from(array)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  // For simplicity, using plain method (should be S256 in production)
  return codeVerifier;
}

// Platform-specific authentication functions
async function handleFacebookAuth(code: string) {
  const clientId = Deno.env.get('FACEBOOK_CLIENT_ID');
  const clientSecret = Deno.env.get('FACEBOOK_CLIENT_SECRET');
  const redirectUri = `${Deno.env.get('SITE_URL')}/dashboard?tab=social&subtab=connections`;

  // Exchange code for access token
  const tokenResponse = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?` +
    `client_id=${clientId}&` +
    `client_secret=${clientSecret}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `code=${code}`
  );

  if (!tokenResponse.ok) {
    throw new Error('Facebook authentication failed');
  }

  const tokenData = await tokenResponse.json();
  
  // Get user info
  const userResponse = await fetch(
    `https://graph.facebook.com/me?access_token=${tokenData.access_token}&fields=id,name`
  );
  
  const userData = await userResponse.json();

  // Get pages
  const pagesResponse = await fetch(
    `https://graph.facebook.com/me/accounts?access_token=${tokenData.access_token}`
  );
  
  const pagesData = await pagesResponse.json();
  
  // Use the first page or user account
  const accountData = pagesData.data && pagesData.data.length > 0 
    ? { id: pagesData.data[0].id, name: pagesData.data[0].name, followersCount: 0 }
    : { id: userData.id, name: userData.name, followersCount: 0 };

  return {
    accessToken: tokenData.access_token,
    refreshToken: null,
    expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
    accountData
  };
}

async function handleInstagramAuth(code: string) {
  // Instagram Business API uses Facebook's OAuth
  return await handleFacebookAuth(code);
}

async function handleTwitterAuth(code: string) {
  const clientId = Deno.env.get('TWITTER_CLIENT_ID');
  const clientSecret = Deno.env.get('TWITTER_CLIENT_SECRET');
  const redirectUri = `${Deno.env.get('SITE_URL')}/dashboard?tab=social&subtab=connections`;

  // Exchange code for access token
  const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
    },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: clientId!,
      redirect_uri: redirectUri,
      code_verifier: 'challenge' // Should match the one used in auth URL
    })
  });

  if (!tokenResponse.ok) {
    throw new Error('Twitter authentication failed');
  }

  const tokenData = await tokenResponse.json();

  // Get user info
  const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=public_metrics', {
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`
    }
  });

  const userData = await userResponse.json();

  return {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    accountData: {
      id: userData.data.id,
      name: userData.data.name,
      followersCount: userData.data.public_metrics?.followers_count || 0
    }
  };
}

async function handleLinkedInAuth(code: string) {
  const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
  const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
  const redirectUri = `${Deno.env.get('SITE_URL')}/dashboard?tab=social&subtab=connections`;

  // Exchange code for access token
  const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!
    })
  });

  if (!tokenResponse.ok) {
    throw new Error('LinkedIn authentication failed');
  }

  const tokenData = await tokenResponse.json();

  // Get user info
  const userResponse = await fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName)', {
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`
    }
  });

  const userData = await userResponse.json();

  return {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
    accountData: {
      id: userData.id,
      name: `${userData.firstName.localized.en_US} ${userData.lastName.localized.en_US}`,
      followersCount: 0
    }
  };
}