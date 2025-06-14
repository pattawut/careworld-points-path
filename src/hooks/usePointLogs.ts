
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface PointLog {
  id: string;
  user_id: string;
  campaign_id: string | null;
  points: number;
  activity_type: string | null;
  description: string | null;
  action_type: 'earned' | 'deducted';
  created_at: string;
}

export const usePointLogs = () => {
  const [pointLogs, setPointLogs] = useState<PointLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const { user } = useAuth();

  const fetchPointLogs = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // ดึงข้อมูล point logs ของ user
      const { data: logs, error: logsError } = await supabase
        .from('user_point_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (logsError) throw logsError;
      
      // Cast the data to proper types
      const typedLogs = (logs || []).map(log => ({
        ...log,
        action_type: log.action_type as 'earned' | 'deducted'
      })) as PointLog[];
      
      setPointLogs(typedLogs);
      
      // คำนวณคะแนนรวม
      const total = typedLogs.reduce((sum, log) => {
        return sum + (log.action_type === 'earned' ? log.points : -log.points);
      }, 0);
      
      setTotalPoints(total);
      
    } catch (error) {
      console.error('Error fetching point logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    if (!user) return;
    
    try {
      // เรียกใช้ function เพื่ออัพเดทคะแนนใน profile
      const { error } = await supabase.rpc('update_profile_points', {
        user_uuid: user.id
      });
      
      if (error) {
        console.error('Error updating profile points:', error);
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPointLogs();
      refreshUserProfile();
    }
  }, [user]);

  return {
    pointLogs,
    totalPoints,
    loading,
    refetch: fetchPointLogs,
    refreshProfile: refreshUserProfile
  };
};
