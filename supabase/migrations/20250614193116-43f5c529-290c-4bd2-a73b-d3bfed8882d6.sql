
-- สร้างตาราง user_point_logs สำหรับเก็บ log การเปลี่ยนแปลงคะแนน
CREATE TABLE public.user_point_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  points INTEGER NOT NULL,
  activity_type TEXT,
  description TEXT,
  action_type TEXT NOT NULL CHECK (action_type IN ('earned', 'deducted', 'bonus', 'penalty')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- เปิดใช้งาน RLS
ALTER TABLE public.user_point_logs ENABLE ROW LEVEL SECURITY;

-- สร้าง policy สำหรับ user_point_logs
CREATE POLICY "Users can view their own point logs" 
  ON public.user_point_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert point logs" 
  ON public.user_point_logs 
  FOR INSERT 
  WITH CHECK (true);

-- สร้างฟังก์ชันคำนวณคะแนนรวมของ user
CREATE OR REPLACE FUNCTION public.calculate_user_total_points(user_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
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

-- สร้างฟังก์ชันอัปเดตคะแนนใน profiles table
CREATE OR REPLACE FUNCTION public.update_profile_points(user_uuid UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.profiles 
  SET eco_points = public.calculate_user_total_points(user_uuid),
      updated_at = now()
  WHERE id = user_uuid;
$$;

-- สร้าง trigger function สำหรับอัปเดตคะแนนใน profiles เมื่อมีการเปลี่ยนแปลงใน user_point_logs
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

-- สร้าง trigger สำหรับ user_point_logs
CREATE TRIGGER trigger_update_profile_points
  AFTER INSERT OR UPDATE OR DELETE ON public.user_point_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_point_log_change();

-- สร้าง trigger function สำหรับ campaigns table เพื่อเพิ่มคะแนนเมื่อ user ทำกิจกรรม
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
    
  -- เมื่อลบ campaign ที่มี user_id
  ELSIF TG_OP = 'DELETE' AND OLD.user_id IS NOT NULL AND OLD.points > 0 THEN
    INSERT INTO public.user_point_logs (
      user_id, 
      campaign_id, 
      points, 
      activity_type, 
      description, 
      action_type
    ) VALUES (
      OLD.user_id,
      OLD.id,
      OLD.points,
      OLD.activity_type,
      'หักคะแนนจากการลบกิจกรรม: ' || COALESCE(OLD.title, OLD.activity_type),
      'deducted'
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

-- สร้าง trigger สำหรับ campaigns table
CREATE TRIGGER trigger_campaign_points
  AFTER INSERT OR UPDATE OR DELETE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_campaign_points();

-- สร้าง index สำหรับ performance
CREATE INDEX idx_user_point_logs_user_id ON public.user_point_logs(user_id);
CREATE INDEX idx_user_point_logs_campaign_id ON public.user_point_logs(campaign_id);
CREATE INDEX idx_user_point_logs_created_at ON public.user_point_logs(created_at DESC);
