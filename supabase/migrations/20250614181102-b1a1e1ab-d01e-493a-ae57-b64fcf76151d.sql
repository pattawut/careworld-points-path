
-- Create education_tags table for managing knowledge topics
CREATE TABLE public.education_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('article', 'video')),
  color TEXT DEFAULT '#10B981',
  content TEXT, -- For article content
  youtube_url TEXT, -- For video URL
  image_url TEXT, -- For article images or video thumbnails
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for education_tags
ALTER TABLE public.education_tags ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing education tags (public read access)
CREATE POLICY "Anyone can view education tags" 
  ON public.education_tags 
  FOR SELECT 
  USING (true);

-- Create policy for admin to manage education tags
CREATE POLICY "Admins can manage education tags" 
  ON public.education_tags 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Add trigger to update updated_at column
CREATE TRIGGER update_education_tags_updated_at 
  BEFORE UPDATE ON public.education_tags 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();
