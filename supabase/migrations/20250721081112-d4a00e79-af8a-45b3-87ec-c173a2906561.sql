-- Alter age_ranges, top_competitors, and genders columns from arrays to strings
ALTER TABLE public.saved_personas 
ALTER COLUMN age_ranges TYPE TEXT USING array_to_string(age_ranges, ', '),
ALTER COLUMN age_ranges SET DEFAULT '',
ALTER COLUMN top_competitors TYPE TEXT USING array_to_string(top_competitors, ', '),
ALTER COLUMN top_competitors SET DEFAULT '',
ALTER COLUMN genders TYPE TEXT USING array_to_string(genders, ', '),
ALTER COLUMN genders SET DEFAULT '';