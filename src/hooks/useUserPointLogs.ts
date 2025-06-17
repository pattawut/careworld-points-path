
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

type PointLog = {
  id: string;
  points: number;
  activity_type: string | null;
  description: string | null;
  action_type: string; // Changed from union type to string to match database
  created_at: string;
  campaign_id: string | null;
  metadata: any;
  quantity: number; // เพิ่ม quantity
};

export const useUserPointLogs = () => {
  const [pointLogs, setPointLogs] = useState<PointLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPointLogs = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch point logs
        const { data: logs, error: logsError } = await supabase
          .from('user_point_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (logsError) throw logsError;

        setPointLogs(logs || []);

        // Calculate total points using the database function
        const { data: totalPointsData, error: totalError } = await supabase
          .rpc('calculate_user_total_points', { user_uuid: user.id });

        if (totalError) throw totalError;

        setTotalPoints(totalPointsData || 0);

      } catch (error: any) {
        console.error('Error fetching point logs:', error);
        toast({
          variant: "destructive",
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลคะแนนได้"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPointLogs();
  }, [user, toast]);

  return {
    pointLogs,
    loading,
    totalPoints
  };
};
