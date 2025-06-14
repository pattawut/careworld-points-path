
-- Remove email column from profiles table since we'll get it from auth.users
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- Drop the email index if it exists
DROP INDEX IF EXISTS idx_profiles_email;

-- Add activity-related columns to campaigns table to merge activities functionality
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS activity_type text;

-- Update campaigns table to include activity types and make some fields optional
ALTER TABLE public.campaigns ALTER COLUMN created_by DROP NOT NULL;
ALTER TABLE public.campaigns ALTER COLUMN title DROP NOT NULL;

-- Update the status check constraint to include 'completed' status
ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_status_check;
ALTER TABLE public.campaigns ADD CONSTRAINT campaigns_status_check 
CHECK (status IN ('draft', 'active', 'promoted', 'coming_soon', 'archived', 'completed'));

-- Copy existing activities data to campaigns table with 'archived' status instead of 'completed'
INSERT INTO public.campaigns (
  id,
  title,
  description,
  image_url,
  points,
  status,
  activity_type,
  user_id,
  created_at,
  updated_at
)
SELECT 
  id,
  COALESCE(activity_type, 'กิจกรรมทั่วไป') as title,
  description,
  image_url,
  COALESCE(points, 1) as points,
  'archived' as status,
  activity_type,
  user_id,
  created_at,
  updated_at
FROM public.activities
ON CONFLICT (id) DO NOTHING;

-- Drop the activities table since we've merged it with campaigns
DROP TABLE IF EXISTS public.activities;
