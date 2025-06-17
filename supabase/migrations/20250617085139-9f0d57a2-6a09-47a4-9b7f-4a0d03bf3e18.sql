
-- เพิ่มคอลัมน์ quantity ในตาราง user_point_logs
ALTER TABLE public.user_point_logs 
ADD COLUMN quantity INTEGER DEFAULT 1 NOT NULL;

-- อัพเดทฟังก์ชันคำนวณคะแนนให้รองรับ quantity
CREATE OR REPLACE FUNCTION public.calculate_user_total_points(user_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    SUM(
      CASE 
        WHEN action_type = 'earned' THEN points * quantity 
        WHEN action_type = 'deducted' THEN -(points * quantity)
        ELSE 0 
      END
    ), 0
  )::INTEGER
  FROM public.user_point_logs 
  WHERE user_id = user_uuid;
$$;

-- รีเซ็ตคะแนนในตาราง profiles ให้ตรงกับการคำนวณใหม่
UPDATE public.profiles 
SET eco_points = public.calculate_user_total_points(id),
    updated_at = now();
