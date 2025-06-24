
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from request
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Generating personas for user:', user.id);

    // Fetch company details and onboarding data
    const [companyDetailsResult, onboardingResult] = await Promise.all([
      supabase
        .from('company_details')
        .select('*')
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('tenant_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .single()
    ]);

    if (companyDetailsResult.error || onboardingResult.error) {
      console.error('Error fetching user data:', companyDetailsResult.error, onboardingResult.error);
      throw new Error('Could not fetch user profile data');
    }

    const companyDetails = companyDetailsResult.data;
    const onboardingData = onboardingResult.data;

    // Create a comprehensive prompt for persona generation
    const prompt = `Based on the following company and business information, generate 3 detailed marketing personas in JSON format.

Company Information:
- Company Name: ${companyDetails.company_name}
- Industry: ${companyDetails.company_industry}
- Location: ${companyDetails.company_address}

Business Details:
- Business Description: ${onboardingData.business_name_description}
- Customer Profile: ${onboardingData.customer_profile}
- Customer Problem: ${onboardingData.customer_problem}
- Unique Selling Proposition: ${onboardingData.unique_selling_proposition}
- Social Media Goals: ${onboardingData.social_media_goals.join(', ')}
- Content Tone: ${onboardingData.content_tone}
- Preferred Platforms: ${onboardingData.preferred_platforms.join(', ')}
- Top Customer Questions: ${onboardingData.top_customer_questions}
- Target Segments: ${onboardingData.target_segments}
- Customer Values: ${onboardingData.customer_values}

Please generate 3 distinct marketing personas that would be ideal customers for this business. For each persona, provide:
- name: A descriptive persona name
- description: A brief description of who they are
- demographics: Age range, education, location, occupation details
- painPoints: Their main challenges and pain points
- goals: What they want to achieve
- preferredChannels: Which social media platforms they use most
- buyingMotivation: What motivates them to make purchasing decisions
- contentPreferences: What type of content resonates with them

Return the response as a JSON array with exactly 3 personas. Make sure the JSON is valid and properly formatted.`;

    console.log('Sending request to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a marketing expert specializing in creating detailed customer personas. Always respond with valid JSON format containing exactly 3 personas.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    const generatedContent = data.choices[0].message.content;
    console.log('Generated content:', generatedContent);

    // Parse the JSON response from OpenAI
    let personas;
    try {
      personas = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Error parsing OpenAI response as JSON:', parseError);
      console.error('Raw content:', generatedContent);
      throw new Error('Failed to parse personas from AI response');
    }

    if (!Array.isArray(personas) || personas.length !== 3) {
      console.error('Invalid personas format:', personas);
      throw new Error('AI did not return exactly 3 personas in the expected format');
    }

    console.log('Successfully generated personas:', personas);

    return new Response(JSON.stringify({ personas }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-personas function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
