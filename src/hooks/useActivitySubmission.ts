
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ActivityData {
  activity_type: string;
  description: string;
  image_url: string;
  points?: number;
  quantity?: number; // เพิ่ม quantity
}

export const useActivitySubmission = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitActivity = async (activityData: ActivityData, userId: string) => {
    setLoading(true);
    try {
      // Get user profile for name
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }

      // Calculate points based on activity type
      const pointsMap = {
        'recycling': 5,
        'energy_saving': 3,
        'water_conservation': 3,
        'transportation': 4,
        'waste_reduction': 4,
        'tree_planting': 6,
        'community_cleanup': 5,
        'education': 2,
        'general': 1
      };

      const points = pointsMap[activityData.activity_type as keyof typeof pointsMap] || 1;
      const quantity = activityData.quantity || 1; // ใช้ quantity ที่ส่งมา หรือ default เป็น 1
      const userName = userProfile?.full_name || 'ผู้ใช้';

      // Insert the campaign
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          user_id: userId,
          activity_type: activityData.activity_type,
          title: `${activityData.activity_type} - กิจกรรมของ ${userName}`,
          description: activityData.description,
          image_url: activityData.image_url,
          points: points,
          status: 'archived'
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Create point log entry manually since we disabled the trigger
      const { error: pointLogError } = await supabase
        .from('user_point_logs')
        .insert({
          user_id: userId,
          campaign_id: campaign.id,
          points: points,
          quantity: quantity, // เพิ่ม quantity ใน point log
          activity_type: activityData.activity_type,
          description: `คะแนนจากการทำกิจกรรม: ${activityData.description}`,
          action_type: 'earned'
        });

      if (pointLogError) {
        console.error('Error creating point log:', pointLogError);
        throw pointLogError; // Throw error to ensure consistency
      }

      console.log('Activity and point log created successfully');

      const totalPoints = points * quantity;
      toast({
        title: "บันทึกกิจกรรมสำเร็จ!",
        description: `คุณได้รับ ${totalPoints} คะแนนจากกิจกรรมนี้ (${points} คะแนน × ${quantity})`,
      });

      return campaign;
    } catch (error: any) {
      console.error('Error submitting activity:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกกิจกรรมได้",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitActivity,
    loading
  };
};
