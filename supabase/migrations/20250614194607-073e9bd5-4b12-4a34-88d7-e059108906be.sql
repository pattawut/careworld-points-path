
-- แก้ไขปัญหา foreign key constraint สำหรับการลบ campaigns
-- และปัญหาการนับคะแนนซ้ำ

-- 1. ลบ trigger ที่ทำให้เกิดการนับคะแนนซ้ำ
DROP TRIGGER IF EXISTS trigger_campaign_points ON public.campaigns;

-- 2. แก้ไข foreign key constraint ให้ cascade delete
ALTER TABLE public.user_point_logs 
DROP CONSTRAINT IF EXISTS user_point_logs_campaign_id_fkey;

ALTER TABLE public.user_point_logs
ADD CONSTRAINT user_point_logs_campaign_id_fkey 
FOREIGN KEY (campaign_id) 
REFERENCES public.campaigns(id) 
ON DELETE CASCADE;

-- 3. ลบ point logs ที่ซ้ำซ้อน (เก็บเฉพาะ record แรกของแต่ละ campaign_id และ user_id)
DELETE FROM public.user_point_logs 
WHERE id IN (
  SELECT id 
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY user_id, campaign_id, action_type 
             ORDER BY created_at ASC
           ) as rn
    FROM public.user_point_logs
    WHERE campaign_id IS NOT NULL
  ) t
  WHERE rn > 1
);

-- 4. อัพเดท trigger function ให้ไม่สร้าง point logs อัตโนมัติ
-- เพราะเราจะจัดการใน application code แทน
CREATE OR REPLACE FUNCTION public.handle_campaign_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- ไม่ทำอะไรเลย เพราะเราจะจัดการ point logs ใน application code
  RETURN CASE 
    WHEN TG_OP = 'DELETE' THEN OLD
    ELSE NEW
  END;
END;
$$;

-- 5. สร้าง trigger ใหม่ (แต่ไม่ทำอะไร)
CREATE TRIGGER trigger_campaign_points
  AFTER INSERT OR UPDATE OR DELETE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_campaign_points();

-- 6. รีเซ็ตคะแนนในตาราง profiles ให้ตรงกับ point logs
UPDATE public.profiles 
SET eco_points = public.calculate_user_total_points(id),
    updated_at = now();
