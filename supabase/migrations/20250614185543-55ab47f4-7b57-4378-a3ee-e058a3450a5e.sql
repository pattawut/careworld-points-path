
-- สร้าง table สำหรับเก็บ log การได้รับคะแนนของ user
CREATE TABLE public.user_point_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  points INTEGER NOT NULL,
  activity_type TEXT,
  description TEXT,
  action_type TEXT NOT NULL CHECK (action_type IN ('earned', 'deducted')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- เปิดใช้ Row Level Security
ALTER TABLE public.user_point_logs ENABLE ROW LEVEL SECURITY;

-- สร้าง policy ให้ user สามารถดู log ของตัวเองได้
CREATE POLICY "Users can view their own point logs" 
  ON public.user_point_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- สร้าง policy ให้ระบบสามารถเพิ่ม log ได้
CREATE POLICY "System can insert point logs" 
  ON public.user_point_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- สร้าง function สำหรับคำนวณคะแนนรวมจาก logs
CREATE OR REPLACE FUNCTION public.calculate_user_total_points(user_uuid UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    SUM(
      CASE 
        WHEN action_type = 'earned' THEN points 
        WHEN action_type = 'deducted' THEN -points 
        ELSE 0 
      END
    ), 0
  )::INTEGER
  FROM public.user_point_logs 
  WHERE user_id = user_uuid;
$$;

-- สร้าง function สำหรับอัพเดทคะแนนใน profiles table
CREATE OR REPLACE FUNCTION public.update_profile_points(user_uuid UUID)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
AS $$
  UPDATE public.profiles 
  SET eco_points = public.calculate_user_total_points(user_uuid),
      updated_at = now()
  WHERE id = user_uuid;
$$;

-- สร้าง trigger function สำหรับอัพเดทคะแนนใน profiles เมื่อมี log ใหม่
CREATE OR REPLACE FUNCTION public.handle_point_log_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- อัพเดทคะแนนใน profiles table
  PERFORM public.update_profile_points(
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.user_id
      ELSE NEW.user_id
    END
  );
  
  RETURN CASE 
    WHEN TG_OP = 'DELETE' THEN OLD
    ELSE NEW
  END;
END;
$$;

-- สร้าง trigger สำหรับอัพเดทคะแนนเมื่อมีการเปลี่ยนแปลง point logs
CREATE TRIGGER update_profile_points_on_log_change
  AFTER INSERT OR UPDATE OR DELETE ON public.user_point_logs
  FOR EACH ROW EXECUTE FUNCTION public.handle_point_log_change();

-- ลบ trigger เก่าที่อัพเดทคะแนนจาก campaigns table
DROP TRIGGER IF EXISTS update_user_points_trigger ON public.campaigns;
DROP TRIGGER IF EXISTS decrease_user_points_trigger ON public.campaigns;

-- สร้าง function ใหม่สำหรับจัดการคะแนนเมื่อมีการเปลี่ยนแปลง campaign
CREATE OR REPLACE FUNCTION public.handle_campaign_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- เมื่อสร้าง campaign ใหม่ที่มี user_id (กิจกรรมของ user)
  IF TG_OP = 'INSERT' AND NEW.user_id IS NOT NULL AND NEW.points > 0 THEN
    INSERT INTO public.user_point_logs (
      user_id, 
      campaign_id, 
      points, 
      activity_type, 
      description, 
      action_type
    ) VALUES (
      NEW.user_id,
      NEW.id,
      NEW.points,
      NEW.activity_type,
      'คะแนนจากการทำกิจกรรม: ' || COALESCE(NEW.title, NEW.activity_type),
      'earned'
    );
    
  -- เมื่ออัพเดท campaign และเปลี่ยนคะแนน
  ELSIF TG_OP = 'UPDATE' AND NEW.user_id IS NOT NULL AND OLD.points != NEW.points THEN
    -- หักคะแนนเก่า
    IF OLD.points > 0 THEN
      INSERT INTO public.user_point_logs (
        user_id, 
        campaign_id, 
        points, 
        activity_type, 
        description, 
        action_type
      ) VALUES (
        NEW.user_id,
        NEW.id,
        OLD.points,
        NEW.activity_type,
        'หักคะแนนเก่าจากการแก้ไขกิจกรรม',
        'deducted'
      );
    END IF;
    
    -- เพิ่มคะแนนใหม่
    IF NEW.points > 0 THEN
      INSERT INTO public.user_point_logs (
        user_id, 
        campaign_id, 
        points, 
        activity_type, 
        description, 
        action_type
      ) VALUES (
        NEW.user_id,
        NEW.id,
        NEW.points,
        NEW.activity_type,
        'คะแนนใหม่จากการแก้ไขกิจกรรม: ' || COALESCE(NEW.title, NEW.activity_type),
        'earned'
      );
    END IF;
  END IF;
  
  RETURN CASE 
    WHEN TG_OP = 'DELETE' THEN OLD
    ELSE NEW
  END;
END;
$$;

-- สร้าง trigger ใหม่สำหรับจัดการคะแนนจาก campaigns
CREATE TRIGGER handle_campaign_points_trigger
  AFTER INSERT OR UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.handle_campaign_points();

-- อัพเดทคะแนนของ user ทั้งหมดใหม่จากข้อมูลที่มีอยู่
INSERT INTO public.user_point_logs (user_id, campaign_id, points, activity_type, description, action_type)
SELECT 
  user_id,
  id,
  points,
  activity_type,
  'คะแนนจากกิจกรรมที่มีอยู่เดิม: ' || COALESCE(title, activity_type),
  'earned'
FROM public.campaigns 
WHERE user_id IS NOT NULL AND points > 0
ON CONFLICT DO NOTHING;
