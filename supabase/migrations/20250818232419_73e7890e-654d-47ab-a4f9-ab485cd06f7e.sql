-- Add moderation columns to scheduled_content table
ALTER TABLE public.scheduled_content 
ADD COLUMN IF NOT EXISTS ai_moderation_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS ai_moderation_confidence numeric(3,2),
ADD COLUMN IF NOT EXISTS ai_moderation_violations text[] DEFAULT ARRAY[]::text[],
ADD COLUMN IF NOT EXISTS ai_moderation_reasons text[] DEFAULT ARRAY[]::text[],
ADD COLUMN IF NOT EXISTS ai_moderation_recommendations text[] DEFAULT ARRAY[]::text[],
ADD COLUMN IF NOT EXISTS ai_moderation_risk_level text DEFAULT 'low',
ADD COLUMN IF NOT EXISTS ai_moderated_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS admin_moderation_status text,
ADD COLUMN IF NOT EXISTS admin_moderation_reason text,
ADD COLUMN IF NOT EXISTS admin_moderated_by uuid,
ADD COLUMN IF NOT EXISTS admin_moderated_at timestamp with time zone;

-- Add check constraint for moderation status values
ALTER TABLE public.scheduled_content 
DROP CONSTRAINT IF EXISTS check_ai_moderation_status;

ALTER TABLE public.scheduled_content 
ADD CONSTRAINT check_ai_moderation_status 
CHECK (ai_moderation_status IN ('pending', 'approved', 'denied'));

ALTER TABLE public.scheduled_content 
DROP CONSTRAINT IF EXISTS check_admin_moderation_status;

ALTER TABLE public.scheduled_content 
ADD CONSTRAINT check_admin_moderation_status 
CHECK (admin_moderation_status IS NULL OR admin_moderation_status IN ('approved', 'denied'));

ALTER TABLE public.scheduled_content 
DROP CONSTRAINT IF EXISTS check_ai_moderation_risk_level;

ALTER TABLE public.scheduled_content 
ADD CONSTRAINT check_ai_moderation_risk_level 
CHECK (ai_moderation_risk_level IN ('low', 'medium', 'high'));

-- Create index for faster queries by moderation status
CREATE INDEX IF NOT EXISTS idx_scheduled_content_ai_moderation_status 
ON public.scheduled_content(ai_moderation_status);

CREATE INDEX IF NOT EXISTS idx_scheduled_content_admin_moderation_status 
ON public.scheduled_content(admin_moderation_status);

-- Create a view for admin content moderation dashboard
CREATE OR REPLACE VIEW public.admin_content_moderation AS
SELECT 
  sc.*,
  cd.name as company_name,
  cd.industry as company_industry
FROM public.scheduled_content sc
LEFT JOIN public.company_details cd ON sc.user_id = cd.user_id
ORDER BY sc.created_at DESC;