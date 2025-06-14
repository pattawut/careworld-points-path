
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ActivityTypeSelector } from './activity/ActivityTypeSelector';
import { ActivityDescriptionField } from './activity/ActivityDescriptionField';
import { ActivityImageUpload } from './activity/ActivityImageUpload';
import { ActivityFormButtons } from './activity/ActivityFormButtons';

interface ActivityFormProps {
  activity?: {
    id: string;
    activity_type: string;
    description: string;
    image_url: string;
  };
  onSuccess: () => void;
  onCancel?: () => void;
}

export const ActivityForm = ({ activity, onSuccess, onCancel }: ActivityFormProps) => {
  const [activityType, setActivityType] = useState(activity?.activity_type || 'recycle');
  const [description, setDescription] = useState(activity?.description || '');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(activity?.image_url || null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const isEditing = !!activity;

  // Update preview when image is changed
  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(activity?.image_url || null);
    }
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
      
      // Handle image upload
      let imageUrl = activity?.image_url || null;
      
      if (image) {
        // Upload new image
        const fileExt = image.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('activity-images')
          .upload(filePath, image);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('activity-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrlData.publicUrl;
        
        // Delete old image if editing
        if (isEditing && activity.image_url) {
          const oldPath = activity.image_url.split('/').pop();
          if (oldPath) {
            await supabase.storage
              .from('activity-images')
              .remove([`${user.id}/${oldPath}`]);
          }
        }
      }
      
      if (isEditing) {
        // Update existing campaign
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
        // Create new campaign (user activity)
        const { error } = await supabase
          .from('campaigns')
          .insert([{
            user_id: user.id,
            activity_type: activityType,
            description,
            image_url: imageUrl,
            points: 1,
            status: 'archived',
            title: activityType
          }]);
          
        if (error) throw error;
        
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
      
      // Call success callback
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
  
  // Validate form
  const isFormValid = !isEditing ? (!!description && !!preview) : !!description;
  
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>{isEditing ? 'แก้ไขกิจกรรม' : 'อัปโหลดกิจกรรม'}</CardTitle>
        <CardDescription>
          {isEditing 
            ? 'แก้ไขรายละเอียดกิจกรรมของคุณ' 
            : 'แชร์ภาพกิจกรรมรักษ์โลกของคุณเพื่อสะสมแต้ม'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ActivityTypeSelector 
            value={activityType}
            onChange={setActivityType}
            isDisabled={isLoading}
          />
          
          <ActivityDescriptionField 
            value={description}
            onChange={setDescription}
            isDisabled={isLoading}
          />
          
          <ActivityImageUpload 
            preview={preview}
            onChange={handleImageChange}
            isDisabled={isLoading}
            isRequired={!isEditing}
          />
          
          <ActivityFormButtons 
            isLoading={isLoading}
            isEditing={isEditing}
            isValid={isFormValid}
            onCancel={onCancel}
          />
        </form>
      </CardContent>
    </Card>
  );
};
