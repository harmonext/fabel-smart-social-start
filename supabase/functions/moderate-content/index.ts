import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Platform-specific moderation rules
const PLATFORM_RULES = {
  facebook: {
    prohibited: [
      'Violence and graphic content',
      'Nudity and sexual content',
      'Hate speech and harassment',
      'Misinformation and false news',
      'Spam and fake engagement',
      'Adult services and products',
      'Dangerous organizations and individuals',
      'Intellectual property violations'
    ],
    allowed: [
      'Educational content',
      'News and current events',
      'Business promotions (following ad policies)',
      'Personal expressions and opinions',
      'Entertainment content',
      'Community discussions'
    ]
  },
  instagram: {
    prohibited: [
      'Nudity and sexual content',
      'Violence and dangerous content',
      'Hate speech and bullying',
      'Fake accounts and impersonation',
      'Spam and inauthentic activity',
      'Self-harm and suicide content',
      'Regulated goods (drugs, weapons)',
      'Intellectual property violations'
    ],
    allowed: [
      'Creative and artistic content',
      'Personal stories and experiences',
      'Business and brand content',
      'Educational and informational posts',
      'Entertainment and lifestyle content',
      'Community engagement'
    ]
  },
  twitter: {
    prohibited: [
      'Violence and physical harm',
      'Harassment and abusive behavior',
      'Hateful conduct',
      'Private information sharing',
      'Non-consensual nudity',
      'Child sexual exploitation',
      'Suicide and self-harm',
      'Synthetic and manipulated media'
    ],
    allowed: [
      'Public conversations and discussions',
      'News and current events sharing',
      'Personal opinions and commentary',
      'Business announcements',
      'Educational content',
      'Entertainment and humor'
    ]
  },
  linkedin: {
    prohibited: [
      'Inappropriate professional content',
      'Spam and irrelevant posts',
      'Hate speech and harassment',
      'False professional claims',
      'Adult content',
      'Political extremism',
      'Scams and fraudulent schemes',
      'Intellectual property violations'
    ],
    allowed: [
      'Professional networking content',
      'Industry insights and news',
      'Career-related posts',
      'Business updates and announcements',
      'Educational and thought leadership',
      'Professional achievements'
    ]
  },
  pinterest: {
    prohibited: [
      'Adult content and nudity',
      'Violence and dangerous content',
      'Hate speech and harassment',
      'Misinformation',
      'Self-harm content',
      'Dangerous goods and activities',
      'Spam and repetitive content',
      'Intellectual property violations'
    ],
    allowed: [
      'DIY and craft projects',
      'Recipe and food content',
      'Home decor and design',
      'Fashion and style inspiration',
      'Travel and lifestyle content',
      'Educational tutorials'
    ]
  },
  tiktok: {
    prohibited: [
      'Violence and graphic content',
      'Nudity and sexual content',
      'Hate speech and harassment',
      'Dangerous activities and challenges',
      'Misinformation',
      'Intellectual property violations',
      'Spam and fake engagement',
      'Minor safety violations'
    ],
    allowed: [
      'Creative and entertaining videos',
      'Educational content',
      'Dance and music content',
      'Comedy and humor',
      'Lifestyle and personal stories',
      'Business and promotional content'
    ]
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('=== MODERATE CONTENT FUNCTION START ===');

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);

    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    const { contentId, title, content, platform } = await req.json();

    console.log(`Moderating content for platform: ${platform}, user: ${user.id}`);

    // Get platform-specific rules
    const platformRules = PLATFORM_RULES[platform.toLowerCase()] || PLATFORM_RULES.facebook;

    const moderationPrompt = `
Analyze the following social media content for platform compliance:

Platform: ${platform}
Title: ${title}
Content: ${content}

Platform-specific prohibited content:
${platformRules.prohibited.map(rule => `- ${rule}`).join('\n')}

Platform-specific allowed content:
${platformRules.allowed.map(rule => `- ${rule}`).join('\n')}

Analyze this content and provide a JSON response with:
{
  "approved": boolean,
  "confidence": number (0-1),
  "violationCategories": [array of violated categories],
  "flaggedReasons": [specific reasons for flags],
  "recommendations": [suggestions for improvement],
  "riskLevel": "low" | "medium" | "high"
}

Be thorough but practical. Consider context and intent. Flag only clear violations or high-risk content.
`;

    console.log('Sending content to OpenAI for moderation analysis');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are an expert content moderator for social media platforms. Analyze content carefully and provide accurate moderation decisions in the requested JSON format.'
          },
          {
            role: 'user',
            content: moderationPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      }),
    });

    console.log('OpenAI moderation response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const moderationResult = JSON.parse(data.choices[0].message.content);

    console.log('Moderation analysis completed:', moderationResult);

    // Update scheduled content with moderation results
    const moderationData = {
      ai_moderation_status: moderationResult.approved ? 'approved' : 'denied',
      ai_moderation_confidence: moderationResult.confidence,
      ai_moderation_violations: moderationResult.violationCategories || [],
      ai_moderation_reasons: moderationResult.flaggedReasons || [],
      ai_moderation_recommendations: moderationResult.recommendations || [],
      ai_moderation_risk_level: moderationResult.riskLevel || 'low',
      ai_moderated_at: new Date().toISOString()
    };

    // Update the scheduled content record
    const { error: updateError } = await supabase
      .from('scheduled_content')
      .update(moderationData)
      .eq('id', contentId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating moderation results:', updateError);
      throw updateError;
    }

    console.log('Moderation results saved to database');

    return new Response(JSON.stringify({
      success: true,
      moderation: moderationResult,
      contentId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in moderate-content function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});