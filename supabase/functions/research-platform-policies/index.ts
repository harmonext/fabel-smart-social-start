import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('=== RESEARCH PLATFORM POLICIES FUNCTION START ===');

    const prompt = `
Research and summarize the content moderation policies for the following social media platforms: Facebook, Instagram, Twitter (X), Pinterest, LinkedIn, and TikTok.

For each platform, provide:
1. Content that is ALLOWED
2. Content that is PROHIBITED/DENIED

Format the response as a structured JSON object with clear checklists for moderation purposes. Focus on the most important and commonly enforced rules.

Include categories like:
- Violence and dangerous content
- Nudity and sexual content
- Hate speech and harassment
- Misinformation
- Spam and fake engagement
- Intellectual property violations
- Adult content
- Political content restrictions
- Commercial content rules
- Platform-specific rules

Make this comprehensive but practical for automated content moderation.

Response format:
{
  "platforms": {
    "facebook": {
      "allowed": [list of allowed content types],
      "prohibited": [list of prohibited content with specific rules]
    },
    "instagram": {
      "allowed": [list],
      "prohibited": [list]
    },
    // ... for each platform
  },
  "commonCategories": {
    "violence": { "description": "", "examples": [] },
    "nudity": { "description": "", "examples": [] },
    // ... other categories
  }
}
`;

    console.log('Sending request to OpenAI for platform policies research');

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
            content: 'You are an expert on social media platform policies and content moderation. Provide accurate, up-to-date information about platform guidelines in the requested JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.1
      }),
    });

    console.log('OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const researchResults = data.choices[0].message.content;

    console.log('Research completed successfully');

    return new Response(JSON.stringify({ 
      success: true,
      research: researchResults 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in research-platform-policies function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
