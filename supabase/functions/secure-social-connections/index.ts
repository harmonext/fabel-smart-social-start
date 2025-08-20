import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://id-preview--0a76fc0b-7626-492c-92d8-8ab1b3bad5ca.lovable.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
}

interface SocialConnectionsRequest {
  action: 'list' | 'refresh' | 'disconnect';
  connectionId?: string;
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

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');

    // Verify the user's JWT token
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

    const { action, connectionId }: SocialConnectionsRequest = await req.json();

    switch (action) {
      case 'list': {
        // Use the secure function to get connections without tokens
        const { data: connections, error } = await supabaseClient
          .rpc('get_user_social_connections_safe', { _user_id: user.id });

        if (error) {
          console.error('Error fetching connections:', error);
          throw error;
        }

        return new Response(
          JSON.stringify({ connections: connections || [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'refresh': {
        if (!connectionId) {
          return new Response(
            JSON.stringify({ error: 'Connection ID required for refresh' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        // Get the connection with tokens (admin access)
        const { data: connection, error: connError } = await supabaseClient
          .from('social_connections')
          .select('*')
          .eq('id', connectionId)
          .eq('user_id', user.id)
          .single();

        if (connError || !connection) {
          return new Response(
            JSON.stringify({ error: 'Resource not found' }),
            { 
              status: 404, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        // Update last_sync_at timestamp
        const { error: updateError } = await supabaseClient
          .from('social_connections')
          .update({ last_sync_at: new Date().toISOString() })
          .eq('id', connectionId)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error updating connection:', updateError);
          throw updateError;
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Connection refreshed successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'disconnect': {
        if (!connectionId) {
          return new Response(
            JSON.stringify({ error: 'Connection ID required for disconnect' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        // Mark connection as inactive instead of deleting
        const { error: updateError } = await supabaseClient
          .from('social_connections')
          .update({ is_active: false })
          .eq('id', connectionId)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error disconnecting:', updateError);
          throw updateError;
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Connection disconnected successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});