
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  tags?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
};

export const useParticipationSubmission = (campaign: Campaign, onSuccess: () => void) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const submitParticipation = async (file: File, description: string) => {
    console.log('Starting submission process...');
    console.log('User:', user);
    console.log('Campaign:', campaign);
    console.log('Selected file:', file);
    console.log('Description:', description);

    if (!user) {
      console.error('No user found');
      toast({
        variant: "destructive",
        title: "กรุณาเข้าสู่ระบบ",
        description: "คุณต้องเข้าสู่ระบบเพื่อเข้าร่วมแคมเปญ"
      });
      return;
    }

    if (!campaign) {
      console.error('No campaign found');
      toast({
        variant: "destructive",
        title: "ไม่พบแคมเปญ",
        description: "กรุณาลองใหม่อีกครั้ง"
      });
      return;
    }

    try {
      console.log('Starting file upload...');
      
      // Get user profile for name
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }

      const userName = userProfile?.full_name || 'ผู้ใช้';
      
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${user.id}.${fileExt}`;
      const filePath = `activities/${fileName}`;

      console.log('Uploading file to path:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('campaign-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`การอัปโหลดรูปภาพล้มเหลว: ${uploadError.message}`);
      }

      console.log('File uploaded successfully:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(uploadData.path);

      console.log('Public URL:', publicUrl);

      // Create user activity record (allow multiple participations)
      const campaignData = {
        title: `${campaign.title} - กิจกรรมของ ${userName}`,
        description: description,
        image_url: publicUrl,
        points: campaign.points,
        user_id: user.id,
        activity_type: campaign.activity_type,
        status: 'completed'
      };

      console.log('Creating campaign with data:', campaignData);

      const { data: newCampaign, error: insertError } = await supabase
        .from('campaigns')
        .insert(campaignData)
        .select('id')
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(`การบันทึกกิจกรรมล้มเหลว: ${insertError.message}`);
      }

      console.log('New campaign created:', newCampaign);

      // Create point log entry manually
      const { error: pointLogError } = await supabase
        .from('user_point_logs')
        .insert({
          user_id: user.id,
          campaign_id: newCampaign.id,
          points: campaign.points,
          activity_type: campaign.activity_type,
          description: `คะแนนจากการเข้าร่วม: ${campaign.title}`,
          action_type: 'earned'
        });

      if (pointLogError) {
        console.error('Error creating point log:', pointLogError);
        throw pointLogError; // Throw error to ensure consistency
      }

      // Copy tags from original campaign to user's activity
      if (campaign.tags && campaign.tags.length > 0 && newCampaign) {
        console.log('Copying tags:', campaign.tags);
        
        const tagRelations = campaign.tags.map(tag => ({
          campaign_id: newCampaign.id,
          tag_id: tag.id
        }));

        console.log('Tag relations to insert:', tagRelations);

        const { error: tagError } = await supabase
          .from('campaign_tag_relations')
          .insert(tagRelations);

        if (tagError) {
          console.error('Error copying tags:', tagError);
          // Don't throw error as the main activity was created successfully
        } else {
          console.log('Tags copied successfully');
        }
      }

      console.log('Activity submission completed successfully');

      toast({
        title: "เข้าร่วมสำเร็จ!",
        description: `คุณได้รับ ${campaign.points} แต้มจากการเข้าร่วมแคมเปญนี้`
      });

      onSuccess();

    } catch (error) {
      console.error('Error submitting activity:', error);
      
      let errorMessage = "ไม่สามารถส่งกิจกรรมได้ กรุณาลองใหม่อีกครั้ง";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: errorMessage
      });
    }
  };

  return { submitParticipation };
};
