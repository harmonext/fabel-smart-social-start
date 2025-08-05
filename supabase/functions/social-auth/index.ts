import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SocialAuthRequest {
  action: 'connect' | 'disconnect' | 'refresh'
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin'
  code?: string
  connectionId?: string
  userId: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { action, platform, code, connectionId, userId }: SocialAuthRequest = await req.json()

    console.log(`Processing ${action} action for ${platform} platform`)

    switch (action) {
      case 'connect':
        return await handleConnect(supabase, platform, code!, userId)
      case 'disconnect':
        return await handleDisconnect(supabase, connectionId!, userId)
      case 'refresh':
        return await handleRefresh(supabase, connectionId!, userId)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Error in social-auth function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function handleConnect(supabase: any, platform: string, code: string, userId: string) {
  let accessToken: string
  let refreshToken: string | null = null
  let expiresAt: string | null = null
  let accountData: any

  switch (platform) {
    case 'facebook':
      const fbResult = await handleFacebookAuth(code)
      accessToken = fbResult.accessToken
      refreshToken = fbResult.refreshToken
      expiresAt = fbResult.expiresAt
      accountData = fbResult.accountData
      break
    
    case 'instagram':
      // Instagram uses Facebook's API for business accounts
      const igResult = await handleInstagramAuth(code)
      accessToken = igResult.accessToken
      refreshToken = igResult.refreshToken
      expiresAt = igResult.expiresAt
      accountData = igResult.accountData
      break
    
    case 'twitter':
      const twitterResult = await handleTwitterAuth(code)
      accessToken = twitterResult.accessToken
      refreshToken = twitterResult.refreshToken
      accountData = twitterResult.accountData
      break
    
    case 'linkedin':
      const linkedinResult = await handleLinkedInAuth(code)
      accessToken = linkedinResult.accessToken
      refreshToken = linkedinResult.refreshToken
      expiresAt = linkedinResult.expiresAt
      accountData = linkedinResult.accountData
      break
    
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }

  // Check if connection already exists
  const { data: existingConnection } = await supabase
    .from('social_connections')
    .select('*')
    .eq('user_id', userId)
    .eq('platform', platform)
    .eq('platform_user_id', accountData.id)
    .single()

  const connectionData = {
    user_id: userId,
    platform: platform,
    platform_user_id: accountData.id,
    account_name: accountData.name,
    followers_count: accountData.followersCount || 0,
    access_token: accessToken,
    refresh_token: refreshToken,
    token_expires_at: expiresAt,
    is_active: true,
    last_sync_at: new Date().toISOString()
  }

  let result
  if (existingConnection) {
    // Update existing connection
    result = await supabase
      .from('social_connections')
      .update(connectionData)
      .eq('id', existingConnection.id)
      .select()
      .single()
  } else {
    // Create new connection
    result = await supabase
      .from('social_connections')
      .insert([connectionData])
      .select()
      .single()
  }

  if (result.error) throw result.error

  return new Response(
    JSON.stringify({ success: true, connection: result.data }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

async function handleDisconnect(supabase: any, connectionId: string, userId: string) {
  const { error } = await supabase
    .from('social_connections')
    .update({ is_active: false })
    .eq('id', connectionId)
    .eq('user_id', userId)

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

async function handleRefresh(supabase: any, connectionId: string, userId: string) {
  // Get the connection details
  const { data: connection, error: fetchError } = await supabase
    .from('social_connections')
    .select('*')
    .eq('id', connectionId)
    .eq('user_id', userId)
    .single()

  if (fetchError) throw fetchError

  let newAccessToken: string
  let newRefreshToken: string | null = null
  let newExpiresAt: string | null = null

  // Refresh token based on platform
  switch (connection.platform) {
    case 'facebook':
    case 'instagram':
      const fbRefresh = await refreshFacebookToken(connection.access_token)
      newAccessToken = fbRefresh.accessToken
      newExpiresAt = fbRefresh.expiresAt
      break
    
    case 'twitter':
      // Twitter OAuth 2.0 doesn't use refresh tokens in the same way
      newAccessToken = connection.access_token
      break
    
    case 'linkedin':
      const linkedinRefresh = await refreshLinkedInToken(connection.refresh_token!)
      newAccessToken = linkedinRefresh.accessToken
      newRefreshToken = linkedinRefresh.refreshToken
      newExpiresAt = linkedinRefresh.expiresAt
      break
    
    default:
      throw new Error(`Unsupported platform for refresh: ${connection.platform}`)
  }

  // Update the connection
  const { error } = await supabase
    .from('social_connections')
    .update({
      access_token: newAccessToken,
      refresh_token: newRefreshToken || connection.refresh_token,
      token_expires_at: newExpiresAt,
      last_sync_at: new Date().toISOString()
    })
    .eq('id', connectionId)

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

// Platform-specific authentication functions
async function handleFacebookAuth(code: string) {
  const clientId = Deno.env.get('FACEBOOK_CLIENT_ID')
  const clientSecret = Deno.env.get('FACEBOOK_CLIENT_SECRET')
  const redirectUri = `${Deno.env.get('SITE_URL')}/dashboard?tab=social&subtab=connections`

  // Exchange code for access token
  const tokenResponse = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?` +
    `client_id=${clientId}&` +
    `client_secret=${clientSecret}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `code=${code}`
  )

  if (!tokenResponse.ok) {
    throw new Error(`Facebook token exchange failed: ${tokenResponse.statusText}`)
  }

  const tokenData = await tokenResponse.json()
  
  // Get user info
  const userResponse = await fetch(
    `https://graph.facebook.com/me?access_token=${tokenData.access_token}&fields=id,name`
  )
  
  const userData = await userResponse.json()

  // Get pages
  const pagesResponse = await fetch(
    `https://graph.facebook.com/me/accounts?access_token=${tokenData.access_token}`
  )
  
  const pagesData = await pagesResponse.json()
  
  // Use the first page or user account
  const accountData = pagesData.data && pagesData.data.length > 0 
    ? { id: pagesData.data[0].id, name: pagesData.data[0].name, followersCount: 0 }
    : { id: userData.id, name: userData.name, followersCount: 0 }

  return {
    accessToken: tokenData.access_token,
    refreshToken: null,
    expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
    accountData
  }
}

async function handleInstagramAuth(code: string) {
  // Instagram Business API uses Facebook's OAuth
  return await handleFacebookAuth(code)
}

async function handleTwitterAuth(code: string) {
  const clientId = Deno.env.get('TWITTER_CLIENT_ID')
  const clientSecret = Deno.env.get('TWITTER_CLIENT_SECRET')
  const redirectUri = `${Deno.env.get('SITE_URL')}/dashboard?tab=social&subtab=connections`

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
      code_verifier: 'challenge' // You should implement PKCE properly
    })
  })

  if (!tokenResponse.ok) {
    throw new Error(`Twitter token exchange failed: ${tokenResponse.statusText}`)
  }

  const tokenData = await tokenResponse.json()

  // Get user info
  const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=public_metrics', {
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`
    }
  })

  const userData = await userResponse.json()

  return {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    accountData: {
      id: userData.data.id,
      name: userData.data.name,
      followersCount: userData.data.public_metrics?.followers_count || 0
    }
  }
}

async function handleLinkedInAuth(code: string) {
  const clientId = Deno.env.get('LINKEDIN_CLIENT_ID')
  const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET')
  const redirectUri = `${Deno.env.get('SITE_URL')}/dashboard?tab=social&subtab=connections`

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
  })

  if (!tokenResponse.ok) {
    throw new Error(`LinkedIn token exchange failed: ${tokenResponse.statusText}`)
  }

  const tokenData = await tokenResponse.json()

  // Get user info
  const userResponse = await fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName)', {
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`
    }
  })

  const userData = await userResponse.json()

  return {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
    accountData: {
      id: userData.id,
      name: `${userData.firstName.localized.en_US} ${userData.lastName.localized.en_US}`,
      followersCount: 0
    }
  }
}

async function refreshFacebookToken(accessToken: string) {
  const clientId = Deno.env.get('FACEBOOK_CLIENT_ID')
  const clientSecret = Deno.env.get('FACEBOOK_CLIENT_SECRET')

  const response = await fetch(
    `https://graph.facebook.com/oauth/access_token?` +
    `grant_type=fb_exchange_token&` +
    `client_id=${clientId}&` +
    `client_secret=${clientSecret}&` +
    `fb_exchange_token=${accessToken}`
  )

  const data = await response.json()
  
  return {
    accessToken: data.access_token,
    expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : null
  }
}

async function refreshLinkedInToken(refreshToken: string) {
  const clientId = Deno.env.get('LINKEDIN_CLIENT_ID')
  const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET')

  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId!,
      client_secret: clientSecret!
    })
  })

  const data = await response.json()

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : null
  }
}