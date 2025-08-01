import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const facebookAppId = Deno.env.get('FACEBOOK_APP_ID')!;
    const facebookAppSecret = Deno.env.get('FACEBOOK_APP_SECRET')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, code, userId, connectionId } = await req.json();

    switch (action) {
      case 'connect': {
        console.log('Processing Facebook connect for user:', userId);
        
        if (!code) {
          return new Response(
            JSON.stringify({ error: 'Authorization code is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Exchange authorization code for access token
        const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: facebookAppId,
            client_secret: facebookAppSecret,
            redirect_uri: `${new URL(req.url).origin}/dashboard?tab=social&subtab=connections`,
            code: code,
          }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
          console.error('Facebook token exchange error:', tokenData.error);
          return new Response(
            JSON.stringify({ error: tokenData.error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get user info from Facebook
        const userResponse = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name&access_token=${tokenData.access_token}`);
        const userData = await userResponse.json();

        if (userData.error) {
          console.error('Facebook user info error:', userData.error);
          return new Response(
            JSON.stringify({ error: userData.error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get page info if user has pages
        let pages = [];
        try {
          const pagesResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}`);
          const pagesData = await pagesResponse.json();
          pages = pagesData.data || [];
        } catch (error) {
          console.log('No pages found or error fetching pages:', error);
        }

        // Store connection in database
        const { data, error } = await supabase
          .from('social_connections')
          .upsert({
            user_id: userId,
            platform: 'facebook',
            platform_user_id: userData.id,
            account_name: userData.name,
            access_token: tokenData.access_token,
            token_expires_at: tokenData.expires_in ? 
              new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
            is_active: true,
            last_sync_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          console.error('Database error:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to save connection' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            connection: data,
            pages: pages 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'disconnect': {
        console.log('Processing Facebook disconnect for connection:', connectionId);
        
        const { error } = await supabase
          .from('social_connections')
          .update({ is_active: false })
          .eq('id', connectionId)
          .eq('user_id', userId);

        if (error) {
          console.error('Database error:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to disconnect' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'refresh': {
        console.log('Processing Facebook token refresh for connection:', connectionId);
        
        // Get current connection
        const { data: connection, error: fetchError } = await supabase
          .from('social_connections')
          .select('*')
          .eq('id', connectionId)
          .eq('user_id', userId)
          .single();

        if (fetchError || !connection) {
          return new Response(
            JSON.stringify({ error: 'Connection not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Refresh Facebook token
        const refreshResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${facebookAppId}&client_secret=${facebookAppSecret}&fb_exchange_token=${connection.access_token}`);
        const refreshData = await refreshResponse.json();

        if (refreshData.error) {
          console.error('Facebook token refresh error:', refreshData.error);
          return new Response(
            JSON.stringify({ error: refreshData.error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Update connection with new token
        const { error: updateError } = await supabase
          .from('social_connections')
          .update({
            access_token: refreshData.access_token,
            token_expires_at: refreshData.expires_in ? 
              new Date(Date.now() + refreshData.expires_in * 1000).toISOString() : null,
            last_sync_at: new Date().toISOString(),
          })
          .eq('id', connectionId)
          .eq('user_id', userId);

        if (updateError) {
          console.error('Database error:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to update token' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in facebook-auth function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});