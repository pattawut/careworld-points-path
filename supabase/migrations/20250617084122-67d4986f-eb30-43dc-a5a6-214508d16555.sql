
-- First, let's check and create only the policies that don't exist yet

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view own activities" ON public.campaigns;
DROP POLICY IF EXISTS "Users can create own activities" ON public.campaigns;
DROP POLICY IF EXISTS "Users can update own activities" ON public.campaigns;
DROP POLICY IF EXISTS "Users can delete own activities" ON public.campaigns;
DROP POLICY IF EXISTS "Anyone can view public campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Admins can view all campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Admins can create campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Admins can update campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Admins can delete campaigns" ON public.campaigns;

-- Create a security definer function to check if user is admin (replace if exists)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- Now create all the policies fresh
-- Policy: Users can view their own activities (campaigns with user_id)
CREATE POLICY "Users can view own activities" 
  ON public.campaigns 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Policy: Users can create their own activities
CREATE POLICY "Users can create own activities" 
  ON public.campaigns 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can update their own activities
CREATE POLICY "Users can update own activities" 
  ON public.campaigns 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Policy: Users can delete their own activities
CREATE POLICY "Users can delete own activities" 
  ON public.campaigns 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Policy: Everyone can view public campaigns (admin-created campaigns without user_id)
CREATE POLICY "Anyone can view public campaigns" 
  ON public.campaigns 
  FOR SELECT 
  USING (user_id IS NULL AND status IN ('active', 'promoted', 'coming_soon'));

-- Policy: Admins can view all campaigns
CREATE POLICY "Admins can view all campaigns" 
  ON public.campaigns 
  FOR SELECT 
  USING (public.is_admin_user());

-- Policy: Admins can create any campaigns
CREATE POLICY "Admins can create campaigns" 
  ON public.campaigns 
  FOR INSERT 
  WITH CHECK (public.is_admin_user());

-- Policy: Admins can update any campaigns
CREATE POLICY "Admins can update campaigns" 
  ON public.campaigns 
  FOR UPDATE 
  USING (public.is_admin_user());

-- Policy: Admins can delete any campaigns
CREATE POLICY "Admins can delete campaigns" 
  ON public.campaigns 
  FOR DELETE 
  USING (public.is_admin_user());
