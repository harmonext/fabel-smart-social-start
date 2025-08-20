-- Fix the security definer view issue by dropping the admin_content_moderation view
-- This view was created as SECURITY DEFINER which bypasses RLS policies inappropriately

DROP VIEW IF EXISTS public.admin_content_moderation;