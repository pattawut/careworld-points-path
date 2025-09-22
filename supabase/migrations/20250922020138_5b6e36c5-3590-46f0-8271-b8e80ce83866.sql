-- Update calculate_user_total_points function to handle quantity properly
CREATE OR REPLACE FUNCTION public.calculate_user_total_points(user_uuid uuid)
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
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
$function$;