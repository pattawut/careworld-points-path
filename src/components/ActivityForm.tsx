
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ImageIcon, Loader2 } from 'lucide-react';

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
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
      
      // If there's a new image, upload it to Supabase Storage
      let imageUrl = activity?.image_url || null;
      
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        // Upload the image
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('activity-images')
          .upload(filePath, image);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL of the uploaded file
        const { data: publicUrlData } = supabase.storage
          .from('activity-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrlData.publicUrl;
        
        // If editing and user uploaded a new image, delete the old one
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
        // Update existing activity
        const { error } = await supabase
          .from('activities')
          .update({
            activity_type: activityType,
            description,
            image_url: imageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', activity.id);
          
        if (error) throw error;
        
        toast({
          title: "แก้ไขกิจกรรมสำเร็จ",
          description: "ข้อมูลกิจกรรมของคุณถูกบันทึกเรียบร้อย",
        });
      } else {
        // Create new activity
        const { error } = await supabase
          .from('activities')
          .insert([{
            user_id: user.id,
            activity_type: activityType,
            description,
            image_url: imageUrl,
            points: 1, // Default points for activity
          }]);
          
        if (error) throw error;
        
        toast({
          title: "อัปโหลดกิจกรรมสำเร็จ",
          description: "ขอบคุณที่ร่วมแบ่งปันกิจกรรมรักษ์โลก",
        });
      }
      
      // Reset form and call success callback
      if (!isEditing) {
        setActivityType('recycle');
        setDescription('');
        setImage(null);
        setPreview(null);
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
  
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>{isEditing ? 'แก้ไขกิจกรรม' : 'อัปโหลดกิจกรรม'}</CardTitle>
        <CardDescription>{isEditing ? 'แก้ไขรายละเอียดกิจกรรมของคุณ' : 'แชร์ภาพกิจกรรมรักษ์โลกของคุณเพื่อสะสมแต้ม'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="activityType" className="text-sm font-medium">
              ประเภทกิจกรรม
            </label>
            <select 
              id="activityType"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              disabled={isLoading}
            >
              <option value="recycle">คัดแยกขยะ</option>
              <option value="bag">ใช้ถุงผ้า</option>
              <option value="cup">ใช้แก้วส่วนตัว</option>
              <option value="straw">ใช้หลอดส่วนตัว</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              คำอธิบายกิจกรรม
            </label>
            <textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="อธิบายสั้นๆ เกี่ยวกับกิจกรรมของคุณ"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">
              รูปภาพกิจกรรม {!isEditing && <span className="text-red-500">*</span>}
            </label>
            {preview ? (
              <div className="relative">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-64 object-cover rounded-md border"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-white"
                  onClick={() => {
                    setPreview(null);
                    setImage(null);
                  }}
                  disabled={isLoading}
                >
                  เปลี่ยนรูป
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-eco-teal bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">คลิกเพื่ออัปโหลดรูปภาพ</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG หรือ HEIC (สูงสุด 5 MB)</p>
                  </div>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isLoading}
                    required={!isEditing}
                  />
                </label>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isLoading}
              >
                ยกเลิก
              </Button>
            )}
            <Button 
              type="submit" 
              className="bg-eco-gradient hover:opacity-90"
              disabled={isLoading || (!isEditing && (!description || !preview))}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'บันทึกการแก้ไข' : 'อัปโหลดกิจกรรม'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
