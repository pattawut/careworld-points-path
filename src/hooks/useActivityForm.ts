
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

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
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(activity?.image_url ? [activity.image_url] : []);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const isEditing = !!activity;

  const handleImageChange = (files: File[]) => {
    setImages(files);
    
    // สร้าง preview URLs
    const newPreviews: string[] = [];
    files.forEach(file => {
      const objectUrl = URL.createObjectURL(file);
      newPreviews.push(objectUrl);
    });
    
    setPreviews(newPreviews);
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
    if (images.length === 0 || !user) return activity?.image_url || null;

    // อัปโหลดรูปแรกเท่านั้น (รักษาความเข้ากันได้กับระบบเดิม)
    const firstImage = images[0];
    const fileExt = firstImage.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('activity-images')
      .upload(filePath, firstImage);
    
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
        setImages([]);
        setPreviews([]);
      }
      
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

  const isFormValid = !isEditing ? (!!description && previews.length > 0) : !!description;

  return {
    activityType,
    setActivityType,
    description,
    setDescription,
    images,
    previews,
    isLoading,
    isEditing,
    isFormValid,
    handleImageChange,
    handleSubmit
  };
};
