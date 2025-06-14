
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ActivityData {
  activity_type: string;
  description: string;
  image_url: string;
  points?: number;
}

export const useActivitySubmission = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitActivity = async (activityData: ActivityData, userId: string) => {
    setLoading(true);
    try {
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

      // Insert the campaign
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          user_id: userId,
          activity_type: activityData.activity_type,
          title: activityData.activity_type,
          description: activityData.description,
          image_url: activityData.image_url,
          points: points,
          status: 'draft'
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Create point log entry
      const { error: pointLogError } = await supabase
        .from('user_point_logs')
        .insert({
          user_id: userId,
          campaign_id: campaign.id,
          points: points,
          activity_type: activityData.activity_type,
          description: `คะแนนจากการทำกิจกรรม: ${activityData.description}`,
          action_type: 'earned'
        });

      if (pointLogError) {
        console.error('Error creating point log:', pointLogError);
        // Don't throw error here, just log it
      }

      toast({
        title: "บันทึกกิจกรรมสำเร็จ!",
        description: `คุณได้รับ ${points} คะแนนจากกิจกรรมนี้`,
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
