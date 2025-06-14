
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type AvatarUploadProps = {
  userId: string;
  currentAvatarUrl: string | null;
  userFullName: string | null;
  onAvatarUpdate: (newAvatarUrl: string) => void;
};

export function AvatarUpload({ userId, currentAvatarUrl, userFullName, onAvatarUpdate }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const getDefaultAvatar = (userId: string) => {
    // สร้าง array ของรูปการ์ตูนน่ารัก
    const cuteAvatars = [
      `https://api.dicebear.com/7.x/adventurer/svg?seed=${userId}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
      `https://api.dicebear.com/7.x/big-smile/svg?seed=${userId}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
      `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${userId}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
    ];
    
    // ใช้ userId เพื่อเลือกรูปแบบสุ่มแต่คงที่
    const index = userId.charCodeAt(0) % cuteAvatars.length;
    return cuteAvatars[index];
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      const file = event.target.files?.[0];
      if (!file) return;

      // ตรวจสอบขนาดไฟล์ (5MB)
      if (file.size > 5242880) {
        toast({
          variant: "destructive",
          title: "ไฟล์ใหญ่เกินไป",
          description: "กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB",
        });
        return;
      }

      // ตรวจสอบประเภทไฟล์
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "ประเภทไฟล์ไม่ถูกต้อง",
          description: "กรุณาเลือกไฟล์รูปภาพ (JPEG, PNG, WebP, GIF)",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // อัปโหลดไฟล์ไป Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // ดึง public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // อัปเดต avatar_url ในฐานข้อมูล
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      // เรียก callback เพื่ออัปเดต UI
      onAvatarUpdate(data.publicUrl);

      toast({
        title: "อัปโหลดสำเร็จ",
        description: "รูปโปรไฟล์ของคุณได้รับการอัปเดตแล้ว",
      });

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปโหลดรูปโปรไฟล์ได้",
      });
    } finally {
      setUploading(false);
    }
  };

  const displayAvatar = currentAvatarUrl || getDefaultAvatar(userId);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={displayAvatar} alt={userFullName || 'User avatar'} />
          <AvatarFallback className="text-lg bg-eco-light text-eco-blue">
            {userFullName?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
        
        <div className="absolute -bottom-2 -right-2">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-eco-teal hover:bg-eco-blue text-white flex items-center justify-center transition-colors">
              <Camera className="h-4 w-4" />
            </div>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
            className="hidden"
          />
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          คลิกที่ไอคอนกล้องเพื่อเปลี่ยนรูปโปรไฟล์
        </p>
        {uploading && (
          <div className="flex items-center gap-2 text-sm text-eco-teal">
            <Upload className="h-4 w-4 animate-pulse" />
            กำลังอัปโหลด...
          </div>
        )}
      </div>
    </div>
  );
}
