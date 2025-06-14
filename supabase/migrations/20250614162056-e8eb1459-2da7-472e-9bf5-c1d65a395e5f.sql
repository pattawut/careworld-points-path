
-- Create table for campaign tags
CREATE TABLE public.campaign_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#10B981',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create junction table for campaign-tag relationships
CREATE TABLE public.campaign_tag_relations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.campaign_tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, tag_id)
);

-- Add RLS policies for campaign_tags
ALTER TABLE public.campaign_tags ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read tags (for displaying)
CREATE POLICY "Everyone can view campaign tags"
ON public.campaign_tags
FOR SELECT
TO public
USING (true);

-- Only authenticated users can manage tags (for admin interface)
CREATE POLICY "Authenticated users can manage campaign tags"
ON public.campaign_tags
FOR ALL
TO authenticated
USING (true);

-- Add RLS policies for campaign_tag_relations
ALTER TABLE public.campaign_tag_relations ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read tag relations
CREATE POLICY "Everyone can view campaign tag relations"
ON public.campaign_tag_relations
FOR SELECT
TO public
USING (true);

-- Only authenticated users can manage tag relations
CREATE POLICY "Authenticated users can manage campaign tag relations"
ON public.campaign_tag_relations
FOR ALL
TO authenticated
USING (true);

-- Insert default tags
INSERT INTO public.campaign_tags (name, color) VALUES
('ทั้งหมด', '#6B7280'),
('ถุงผ้า', '#10B981'),
('นำกลับมาใช้ซ้ำ', '#3B82F6'),
('รีไซเคิล', '#F59E0B'),
('ลดการใช้', '#EF4444');

-- Add trigger to update updated_at column for campaign_tags
CREATE TRIGGER update_campaign_tags_updated_at
  BEFORE UPDATE ON public.campaign_tags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
