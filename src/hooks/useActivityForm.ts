
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { usePointLogs } from '@/hooks/usePointLogs';

interface Activity {
  id: string;
  activity_type: string;
  description: string;
  image_url: string;
}

interface UseActivityFormProps {
  activity?: Activity;
  onSuccess: () => void;
}

export const useActivityForm = ({ activity, onSuccess }: UseActivityFormProps) => {
  const [activityType, setActivityType] = useState(activity?.activity_type || 'recycle');
  const [description, setDescription] = useState(activity?.description || '');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(activity?.image_url || null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { refetch: refetchPointLogs, refreshProfile } = usePointLogs();
  const isEditing = !!activity;

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(activity?.image_url || null);
    }
  };

  const copyTagsFromSelectedCampaign = async (newCampaignId: string, selectedActivityType: string) => {
    try {
      const { data: sourceCampaign, error: campaignError } = await supabase
        .from('campaigns')
        .select(`
          id,
          campaign_tag_relations (
            tag_id
          )
        `)
        .eq('activity_type', selectedActivityType)
        .eq('status', 'active')
        .is('user_id', null)
        .limit(1)
        .single();

      if (campaignError || !sourceCampaign) {
        console.log('No source campaign found for activity type:', selectedActivityType);
        return;
      }

      if (sourceCampaign.campaign_tag_relations && sourceCampaign.campaign_tag_relations.length > 0) {
        const tagRelations = sourceCampaign.campaign_tag_relations.map((relation: any) => ({
          campaign_id: newCampaignId,
          tag_id: relation.tag_id
        }));

        const { error: tagError } = await supabase
          .from('campaign_tag_relations')
          .insert(tagRelations);

        if (tagError) {
          console.error('Error copying tags:', tagError);
        } else {
          console.log('Tags copied successfully for activity');
        }
      }
    } catch (error) {
      console.error('Error in copyTagsFromSelectedCampaign:', error);
    }
  };

  const handleImageUpload = async () => {
    if (!image || !user) return activity?.image_url || null;

    const fileExt = image.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('activity-images')
      .upload(filePath, image);
    
    if (uploadError) {
      throw uploadError;
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('activity-images')
      .getPublicUrl(filePath);
      
    // Delete old image if editing
    if (isEditing && activity?.image_url) {
      const oldPath = activity.image_url.split('/').pop();
      if (oldPath) {
        await supabase.storage
          .from('activity-images')
          .remove([`${user.id}/${oldPath}`]);
      }
    }

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "ไม่สามารถดำเนินการได้",
        description: "กรุณาเข้าสู่ระบบก่อนทำรายการ",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const imageUrl = await handleImageUpload();
      
      if (isEditing) {
        const { error } = await supabase
          .from('campaigns')
          .update({
            activity_type: activityType,
            description,
            image_url: imageUrl,
            updated_at: new Date().toISOString(),
            status: 'archived'
          })
          .eq('id', activity.id);
          
        if (error) throw error;
        
        toast({
          title: "แก้ไขกิจกรรมสำเร็จ",
          description: "ข้อมูลกิจกรรมของคุณถูกบันทึกเรียบร้อย",
        });
      } else {
        const { data: newCampaign, error } = await supabase
          .from('campaigns')
          .insert([{
            user_id: user.id,
            activity_type: activityType,
            description,
            image_url: imageUrl,
            points: 1,
            status: 'archived',
            title: activityType
          }])
          .select('id')
          .single();
          
        if (error) throw error;

        if (newCampaign) {
          await copyTagsFromSelectedCampaign(newCampaign.id, activityType);
        }
        
        toast({
          title: "อัปโหลดกิจกรรมสำเร็จ",
          description: "ขอบคุณที่ร่วมแบ่งปันกิจกรรมรักษ์โลก",
        });
        
        // Reset form
        setActivityType('recycle');
        setDescription('');
        setImage(null);
        setPreview(null);
      }
      
      // รีเฟรช point logs และ profile หลังจากบันทึกสำเร็จ
      await refetchPointLogs();
      await refreshProfile();
      
      onSuccess();
      
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถบันทึกกิจกรรมได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = !isEditing ? (!!description && !!preview) : !!description;

  return {
    activityType,
    setActivityType,
    description,
    setDescription,
    image,
    preview,
    isLoading,
    isEditing,
    isFormValid,
    handleImageChange,
    handleSubmit
  };
};
