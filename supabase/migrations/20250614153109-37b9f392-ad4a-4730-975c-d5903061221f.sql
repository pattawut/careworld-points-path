
-- Create campaigns table for managing activities/events
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  points INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'promoted', 'coming_soon', 'archived')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on campaigns table
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = is_admin.user_id 
    AND role = 'admin'
  );
$$;

-- Policy: Everyone can view active and promoted campaigns
CREATE POLICY "Anyone can view public campaigns" 
  ON public.campaigns 
  FOR SELECT 
  USING (status IN ('active', 'promoted', 'coming_soon'));

-- Policy: Admins can view all campaigns
CREATE POLICY "Admins can view all campaigns" 
  ON public.campaigns 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- Policy: Admins can insert campaigns
CREATE POLICY "Admins can create campaigns" 
  ON public.campaigns 
  FOR INSERT 
  WITH CHECK (public.is_admin(auth.uid()));

-- Policy: Admins can update campaigns
CREATE POLICY "Admins can update campaigns" 
  ON public.campaigns 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

-- Policy: Admins can delete campaigns
CREATE POLICY "Admins can delete campaigns" 
  ON public.campaigns 
  FOR DELETE 
  USING (public.is_admin(auth.uid()));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for campaigns updated_at
CREATE TRIGGER update_campaigns_updated_at 
  BEFORE UPDATE ON public.campaigns 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add RLS policies for activities table (if not already exists)
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own activities
CREATE POLICY "Users can view own activities" 
  ON public.activities 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own activities
CREATE POLICY "Users can create own activities" 
  ON public.activities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own activities
CREATE POLICY "Users can update own activities" 
  ON public.activities 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own activities
CREATE POLICY "Users can delete own activities" 
  ON public.activities 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Policy: Admins can view all activities
CREATE POLICY "Admins can view all activities" 
  ON public.activities 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Add RLS policies for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- Policy: Admins can update all profiles
CREATE POLICY "Admins can update all profiles" 
  ON public.profiles 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));
