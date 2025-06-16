
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

type Campaign = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  points: number;
  start_date: string | null;
  end_date: string | null;
  status: string;
  activity_type: string | null;
};

export const useParticipationSubmission = (campaign: Campaign, onSuccess: () => void) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const submitParticipation = async (file: File | null, description: string) => {
    if (!user) {
      toast({
        title: "ไม่สามารถดำเนินการได้",
        description: "กรุณาเข้าสู่ระบบก่อนทำรายการ",
        variant: "destructive",
      });
      return;
    }

    try {
      let imageUrl = null;
      
      // Upload image only if file is provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('activity-images')
          .upload(filePath, file);
        
        if (uploadError) {
          throw uploadError;
        }
        
        const { data: publicUrlData } = supabase.storage
          .from('activity-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrlData.publicUrl;
      }

      // Create user activity entry
      const { data: newActivity, error: activityError } = await supabase
        .from('campaigns')
        .insert([{
          user_id: user.id,
          activity_type: campaign.activity_type,
          title: `กิจกรรม: ${campaign.title}`,
          description: description || `เข้าร่วมกิจกรรม: ${campaign.title}`,
          image_url: imageUrl,
          points: campaign.points,
          status: 'archived'
        }])
        .select('id')
        .single();
        
      if (activityError) throw activityError;

      // Create point log entry
      const { error: pointLogError } = await supabase
        .from('user_point_logs')
        .insert({
          user_id: user.id,
          campaign_id: newActivity.id,
          points: campaign.points,
          activity_type: campaign.activity_type || 'general',
          description: `คะแนนจากการเข้าร่วมกิจกรรม: ${campaign.title}`,
          action_type: 'earned'
        });

      if (pointLogError) {
        console.error('Error creating point log:', pointLogError);
        throw pointLogError;
      }

      toast({
        title: "เข้าร่วมกิจกรรมสำเร็จ",
        description: `คุณได้รับ ${campaign.points} แต้มจากการเข้าร่วมกิจกรรม`,
      });

      onSuccess();
      
    } catch (error: any) {
      console.error('Error submitting participation:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถส่งกิจกรรมได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  return {
    submitParticipation
  };
};
