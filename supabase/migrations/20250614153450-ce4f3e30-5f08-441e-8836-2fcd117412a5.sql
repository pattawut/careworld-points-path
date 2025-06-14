
-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));

-- Update the is_admin function to check role from profiles table
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = is_admin.user_id 
    AND role = 'admin'
  );
$$;

-- Drop the user_roles table policies and table (if you want to completely remove it)
-- Note: This will remove all existing role data, so make sure to migrate any existing admin users first
DROP TABLE IF EXISTS public.user_roles CASCADE;
