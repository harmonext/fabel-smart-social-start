import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== GENERATE CONTENT FUNCTION START ===');
    
    const { personaName } = await req.json();
    console.log('Request body parsed:', { personaName });
    
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.error('No authorization header found');
      throw new Error('No authorization header');
    }

    // Extract user from JWT
    const jwt = authHeader.replace('Bearer ', '');
    console.log('JWT extracted, length:', jwt.length);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    console.log('User auth result:', { user: user?.id, authError });
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      throw new Error('Unauthorized: ' + (authError?.message || 'No user found'));
    }

    console.log('Generating content for persona:', personaName, 'user:', user.id);

    // Get persona data
    const { data: persona, error: personaError } = await supabase
      .from('saved_personas')
      .select('*')
      .eq('name', personaName)
      .eq('user_id', user.id)
      .maybeSingle();

    console.log('Persona query result:', { persona, personaError, personaName, userId: user.id });

    if (personaError) {
      console.error('Error fetching persona:', personaError);
      throw new Error('Failed to fetch persona: ' + personaError.message);
    }

    if (!persona) {
      console.log('No persona found, creating default content generation');
      // If no saved persona found, create a basic one for content generation
      const defaultPersona = {
        name: personaName,
        description: "Default persona for content generation",
        social_media_top_1: "LinkedIn",
        social_media_top_2: "Twitter", 
        social_media_top_3: "Instagram",
        location: "Global",
        psychographics: "Professional, growth-focused",
        age_ranges: "25-45",
        genders: "All"
      };
      console.log('Using default persona:', defaultPersona);
    }

    // Get company details and goals
    const { data: companyDetails, error: companyError } = await supabase
      .from('marketing_onboarding')
      .select('goals')
      .eq('user_id', user.id)
      .maybeSingle();

    console.log('Company details query result:', { companyDetails, companyError });

    if (companyError) {
      console.error('Error fetching company details:', companyError);
      throw new Error('Failed to fetch company details: ' + companyError.message);
    }

    const actualPersona = persona || {
      name: personaName,
      description: "Default persona for content generation",
      social_media_top_1: "LinkedIn",
      social_media_top_2: "Twitter", 
      social_media_top_3: "Instagram",
      location: "Global",
      psychographics: "Professional, growth-focused",
      age_ranges: "25-45",
      genders: "All"
    };

    const socialPlatforms = [
      actualPersona.social_media_top_1,
      actualPersona.social_media_top_2, 
      actualPersona.social_media_top_3
    ].filter(Boolean);

    const goals = companyDetails?.goals || ['Brand Awareness', 'Customer Engagement'];

    // Create prompt for OpenAI
    const currentDate = new Date();
    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 1);
    const nextWeekDate = new Date(currentDate);
    nextWeekDate.setDate(currentDate.getDate() + 7);
    
    const prompt = `Generate social media content for the following persona and goals:

Persona: ${actualPersona.name}
Description: ${actualPersona.description}
Demographics: ${actualPersona.age_ranges}, ${actualPersona.genders}
Location: ${actualPersona.location}
Psychographics: ${actualPersona.psychographics}

Social Media Platforms: ${socialPlatforms.join(', ')}
Company Goals: ${goals.join(', ')}

Create engaging social media captions for each platform and each goal combination. For each caption, provide:
- A compelling title (max 100 characters)
- Engaging content appropriate for the platform (LinkedIn: professional tone, Twitter: casual/trending, etc.)
- Platform-specific best practices (hashtags, mentions, etc.)
- Schedule the content over the next 7 days with optimal posting times for each platform

IMPORTANT: All scheduled_at dates must be in the future. Start from tomorrow (${tomorrowDate.toISOString().split('T')[0]}) and schedule up to one week from now (${nextWeekDate.toISOString().split('T')[0]}). Do not use past dates or today's date.

Return the response as a JSON array with this exact structure:
[
  {
    "title": "Caption title here",
    "content": "Full caption content here with hashtags and platform-specific formatting, but no emojis",
    "platform": "linkedin", 
    "persona_name": "${actualPersona.name}",
    "goal": "company goal to which this content applies",
    "scheduled_at": "2025-01-XX 10:00:00"
  }
]

Make sure to:
- Create content for each platform (${socialPlatforms.length} platforms)
- Address each company goal (${goals.length} goals)
- Use appropriate tone and formatting for each platform
- Include relevant hashtags and calls-to-action
- Schedule posts at optimal times (LinkedIn: weekdays 8-10am, Twitter: weekdays 9am-3pm, etc.)
- Spread content over 7 days to avoid overwhelming followers
- ENSURE ALL scheduled_at dates are FUTURE dates only, starting from tomorrow
- DO NOT include any emojis in the generated content`;

    console.log('Sending request to OpenAI with prompt length:', prompt.length);
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment');
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a social media marketing expert. Always return valid JSON arrays with the exact structure requested. Use current dates starting from tomorrow for scheduling.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    console.log('OpenAI response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('OpenAI response received:', generatedContent);

    // Parse the JSON response
    let contentArray;
    try {
      // Extract JSON from the response (remove any markdown formatting)
      const jsonMatch = generatedContent.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : generatedContent;
      contentArray = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Invalid response format from OpenAI');
    }

    if (!Array.isArray(contentArray)) {
      throw new Error('OpenAI response is not an array');
    }

    console.log('Parsed content array:', contentArray.length, 'items');

    // Save each content item to scheduled_content table
    const contentToInsert = contentArray.map(item => ({
      user_id: user.id,
      title: item.title,
      content: item.content,
      platform: item.platform.toLowerCase(),
      persona_name: item.persona_name,
      goal: item.goal,
      scheduled_at: item.scheduled_at,
      status: 'draft'
    }));

    const { data: insertedContent, error: insertError } = await supabase
      .from('scheduled_content')
      .insert(contentToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting content:', insertError);
      throw new Error('Failed to save generated content');
    }

    console.log('Successfully inserted', insertedContent?.length, 'content items');

    return new Response(JSON.stringify({ 
      success: true, 
      contentGenerated: insertedContent?.length || 0,
      content: insertedContent 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== ERROR IN GENERATE-CONTENT FUNCTION ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
      details: 'Check function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});