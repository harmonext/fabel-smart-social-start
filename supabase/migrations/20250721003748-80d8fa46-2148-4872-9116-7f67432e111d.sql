-- Add new columns to saved_personas table
ALTER TABLE public.saved_personas 
ADD COLUMN social_media_top_1 TEXT NOT NULL DEFAULT '',
ADD COLUMN social_media_top_2 TEXT,
ADD COLUMN social_media_top_3 TEXT,
ADD COLUMN location TEXT NOT NULL DEFAULT '',
ADD COLUMN psychographics TEXT NOT NULL DEFAULT '',
ADD COLUMN age_ranges TEXT[] NOT NULL DEFAULT '{}',
ADD COLUMN genders TEXT[] NOT NULL DEFAULT '{}',
ADD COLUMN top_competitors TEXT[] NOT NULL DEFAULT '{}',
ADD COLUMN cac_estimate NUMERIC,
ADD COLUMN ltv_estimate NUMERIC,
ADD COLUMN appeal_howto TEXT NOT NULL DEFAULT '';