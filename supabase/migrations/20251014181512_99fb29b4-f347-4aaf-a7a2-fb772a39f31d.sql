-- Add columns to store AI's original platform recommendations and user's custom choices
ALTER TABLE saved_personas
ADD COLUMN IF NOT EXISTS ai_platforms jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS user_platforms jsonb DEFAULT NULL;

-- Add comment to explain the columns
COMMENT ON COLUMN saved_personas.ai_platforms IS 'AI-generated platform recommendations in order [platform1, platform2, platform3]';
COMMENT ON COLUMN saved_personas.user_platforms IS 'User-customized platform choices in order [platform1, platform2, platform3]. NULL means using AI recommendations.';