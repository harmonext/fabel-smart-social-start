import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AdminContentRequest {
  action: 'list' | 'moderate' | 'bulk_moderate';
  contentId?: string;
  contentIds?: string[];
  decision?: 'approved' | 'denied';
  reason?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Admin content moderation request received');

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
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user has admin or super_admin role
    const { data: userRole, error: roleError } = await supabaseClient
      .rpc('get_user_role', { _user_id: user.id });

    if (roleError || !userRole || (userRole !== 'admin' && userRole !== 'super_admin')) {
      console.error('User lacks admin privileges:', { userId: user.id, role: userRole });
      return new Response(
        JSON.stringify({ error: 'Insufficient privileges. Admin access required.' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { action, contentId, contentIds, decision, reason }: AdminContentRequest = await req.json();
    console.log('Processing action:', action);

    switch (action) {
      case 'list': {
        // Get all content with company details for moderation
        const { data: content, error } = await supabaseClient
          .from('scheduled_content')
          .select(`
            *,
            company_details!inner(name, industry)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching content:', error);
          throw error;
        }

        // Transform the data to match the expected format
        const transformedContent = content?.map(item => ({
          ...item,
          company_name: item.company_details?.name || null,
          company_industry: item.company_details?.industry || null
        })) || [];

        return new Response(
          JSON.stringify({ content: transformedContent }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'moderate': {
        if (!contentId || !decision) {
          return new Response(
            JSON.stringify({ error: 'Content ID and decision required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        const { error: updateError } = await supabaseClient
          .from('scheduled_content')
          .update({
            admin_moderation_status: decision,
            admin_moderation_reason: reason || null,
            admin_moderated_by: user.id,
            admin_moderated_at: new Date().toISOString()
          })
          .eq('id', contentId);

        if (updateError) {
          console.error('Error moderating content:', updateError);
          throw updateError;
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Content ${decision} successfully` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'bulk_moderate': {
        if (!contentIds || contentIds.length === 0 || !decision) {
          return new Response(
            JSON.stringify({ error: 'Content IDs and decision required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        const { error: updateError } = await supabaseClient
          .from('scheduled_content')
          .update({
            admin_moderation_status: decision,
            admin_moderation_reason: reason || null,
            admin_moderated_by: user.id,
            admin_moderated_at: new Date().toISOString()
          })
          .in('id', contentIds);

        if (updateError) {
          console.error('Error bulk moderating content:', updateError);
          throw updateError;
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `${contentIds.length} items ${decision} successfully` 
          }),
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