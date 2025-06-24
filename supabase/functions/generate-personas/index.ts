
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to clean and extract JSON from OpenAI response
const cleanJsonResponse = (content: string): string => {
  // Remove markdown code blocks if present
  let cleaned = content.trim();
  
  // Remove ```json and ``` markers
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '');
  }
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  
  return cleaned.trim();
};

// Fallback personas when OpenAI is unavailable
const getFallbackPersonas = (hasCompanyData: boolean, companyDetails?: any, onboardingData?: any) => {
  if (hasCompanyData && (companyDetails || onboardingData)) {
    // Generate more specific personas based on available company data
    const industry = companyDetails?.company_industry || 'business';
    const customerProfile = onboardingData?.customer_profile || 'professionals';
    
    return [
      {
        name: `The ${industry} Professional`,
        description: `Decision-makers in the ${industry} industry who value efficiency and results`,
        demographics: `Ages 30-50, college-educated, ${companyDetails?.company_address || 'urban/suburban'} based`,
        painPoints: `Time constraints, need for reliable solutions, staying competitive in ${industry}`,
        goals: `Improve business outcomes, streamline operations, achieve professional growth`,
        preferredChannels: `LinkedIn, industry publications, email newsletters`,
        buyingMotivation: `ROI, reliability, and proven track record`,
        contentPreferences: `Case studies, industry insights, how-to guides, webinars`
      },
      {
        name: "The Growth-Oriented Leader",
        description: `Forward-thinking leaders focused on scaling and innovation`,
        demographics: `Ages 35-55, leadership roles, tech-savvy`,
        painPoints: `Scaling challenges, team management, staying ahead of trends`,
        goals: `Business growth, team development, market expansion`,
        preferredChannels: `LinkedIn, business podcasts, conferences`,
        buyingMotivation: `Innovation, scalability, competitive advantage`,
        contentPreferences: `Thought leadership, success stories, trend analysis`
      },
      {
        name: "The Practical Implementer",
        description: `Hands-on professionals who focus on practical solutions`,
        demographics: `Ages 25-45, implementation-focused roles`,
        painPoints: `Resource limitations, time pressures, need for practical solutions`,
        goals: `Efficient execution, problem-solving, skill development`,
        preferredChannels: `Professional forums, YouTube, industry blogs`,
        buyingMotivation: `Practicality, ease of use, clear benefits`,
        contentPreferences: `Tutorials, best practices, tool comparisons`
      }
    ];
  }

  // Generic fallback personas
  return [
    {
      name: "The Strategic Executive",
      description: "C-level executives and senior managers focused on strategic growth",
      demographics: "Ages 40-60, MBA or equivalent experience, urban markets",
      painPoints: "Limited time, need for high-level insights, pressure for results",
      goals: "Drive company growth, optimize operations, stay competitive",
      preferredChannels: "LinkedIn, business publications, executive networks",
      buyingMotivation: "Strategic value, ROI, competitive advantage",
      contentPreferences: "Executive summaries, market analysis, thought leadership"
    },
    {
      name: "The Innovative Entrepreneur",
      description: "Small business owners and startup founders seeking growth",
      demographics: "Ages 25-45, self-motivated, technology-adopters",
      painPoints: "Limited resources, wearing multiple hats, scaling challenges",
      goals: "Build successful business, achieve work-life balance, create impact",
      preferredChannels: "Social media, entrepreneur communities, podcasts",
      buyingMotivation: "Innovation, efficiency, growth potential",
      contentPreferences: "Success stories, practical tips, industry trends"
    },
    {
      name: "The Detail-Oriented Professional",
      description: "Mid-level professionals focused on execution and quality",
      demographics: "Ages 28-42, specialized expertise, suburban/urban",
      painPoints: "Staying updated with trends, process improvement, career advancement",
      goals: "Professional development, skill enhancement, career growth",
      preferredChannels: "Professional networks, industry forums, training platforms",
      buyingMotivation: "Quality, reliability, professional development",
      contentPreferences: "How-to guides, best practices, certification content"
    }
  ];
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from request
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Authentication error:', authError);
      throw new Error('Unauthorized');
    }

    console.log('Generating personas for user:', user.id);

    // Fetch company details and onboarding data
    console.log('Fetching company details...');
    const { data: companyDetails, error: companyError } = await supabase
      .from('company_details')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (companyError) {
      console.error('Error fetching company details:', companyError);
    } else {
      console.log('Company details found:', !!companyDetails);
    }

    console.log('Fetching onboarding data...');
    const { data: onboardingData, error: onboardingError } = await supabase
      .from('tenant_onboarding')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (onboardingError) {
      console.error('Error fetching onboarding data:', onboardingError);
    } else {
      console.log('Onboarding data found:', !!onboardingData);
    }

    const hasData = !!(companyDetails || onboardingData);
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    // Try OpenAI first if API key is available
    if (OPENAI_API_KEY) {
      try {
        console.log('Attempting OpenAI persona generation...');
        
        // Create a comprehensive prompt for persona generation
        let prompt = `Generate 3 detailed marketing personas in JSON format for a business. `;

        if (companyDetails) {
          prompt += `\n\nCompany Information:
- Company Name: ${companyDetails.company_name || 'Not provided'}
- Industry: ${companyDetails.company_industry || 'Not provided'}
- Location: ${companyDetails.company_address || 'Not provided'}`;
        }

        if (onboardingData) {
          prompt += `\n\nBusiness Details:
- Business Description: ${onboardingData.business_name_description || 'Not provided'}
- Customer Profile: ${onboardingData.customer_profile || 'Not provided'}
- Customer Problem: ${onboardingData.customer_problem || 'Not provided'}
- Unique Selling Proposition: ${onboardingData.unique_selling_proposition || 'Not provided'}
- Social Media Goals: ${onboardingData.social_media_goals?.join(', ') || 'Not provided'}
- Content Tone: ${onboardingData.content_tone || 'Not provided'}
- Preferred Platforms: ${onboardingData.preferred_platforms?.join(', ') || 'Not provided'}
- Top Customer Questions: ${onboardingData.top_customer_questions || 'Not provided'}
- Target Segments: ${onboardingData.target_segments || 'Not provided'}
- Customer Values: ${onboardingData.customer_values || 'Not provided'}`;
        }

        if (!hasData) {
          prompt = `Generate 3 detailed marketing personas in JSON format for a general business. Create diverse personas that could apply to various types of businesses.`;
        }

        prompt += `\n\nPlease generate 3 distinct marketing personas that would be ideal customers for this business. For each persona, provide:
- name: A descriptive persona name
- description: A brief description of who they are
- demographics: Age range, education, location, occupation details
- painPoints: Their main challenges and pain points
- goals: What they want to achieve
- preferredChannels: Which social media platforms they use most
- buyingMotivation: What motivates them to make purchasing decisions
- contentPreferences: What type of content resonates with them

Return the response as a JSON array with exactly 3 personas. Make sure the JSON is valid and properly formatted. Do not include any markdown formatting or code blocks in your response.`;

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
                content: 'You are a marketing expert specializing in creating detailed customer personas. Always respond with valid JSON format containing exactly 3 personas. Do not use markdown formatting or code blocks in your response.'
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

        if (response.ok) {
          const data = await response.json();
          console.log('OpenAI response received successfully');

          if (data.choices && data.choices[0] && data.choices[0].message) {
            const generatedContent = data.choices[0].message.content;
            console.log('Raw OpenAI response:', generatedContent);
            
            try {
              // Clean the response before parsing
              const cleanedContent = cleanJsonResponse(generatedContent);
              console.log('Cleaned content:', cleanedContent);
              
              const personas = JSON.parse(cleanedContent);
              if (Array.isArray(personas) && personas.length === 3) {
                console.log('Successfully generated personas with OpenAI');
                return new Response(JSON.stringify({ personas }), {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
              } else {
                console.error('Invalid personas array structure:', personas);
              }
            } catch (parseError) {
              console.error('Error parsing OpenAI response:', parseError);
              console.error('Failed content:', generatedContent);
            }
          }
        } else {
          const errorText = await response.text();
          console.error('OpenAI API error:', response.status, errorText);
        }
      } catch (openaiError) {
        console.error('OpenAI request failed:', openaiError);
      }
    }

    // Fallback to generated personas
    console.log('Using fallback persona generation');
    const personas = getFallbackPersonas(hasData, companyDetails, onboardingData);
    
    console.log('Successfully generated fallback personas');
    return new Response(JSON.stringify({ personas }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-personas function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred while generating personas' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
