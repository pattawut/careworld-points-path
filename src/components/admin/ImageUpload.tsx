
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Link } from 'lucide-react';

interface ImageUploadProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
}

export const ImageUpload = ({ imageUrl, onImageUrlChange }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ตรวจสอบประเภทไฟล์
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "ประเภทไฟล์ไม่ถูกต้อง",
        description: "กรุณาเลือกไฟล์รูปภาพเท่านั้น"
      });
      return;
    }

    // ตรวจสอบขนาดไฟล์ (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "ไฟล์ใหญ่เกินไป",
        description: "กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB"
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('campaign-images')
        .upload(fileName, file);

      if (error) throw error;

      // สร้าง public URL
      const { data: { publicUrl } } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(data.path);

      onImageUrlChange(publicUrl);
      
      toast({
        title: "อัปโหลดสำเร็จ",
        description: "รูปภาพได้รับการอัปโหลดแล้ว"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปโหลดรูปภาพได้"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label>รูปภาพ</Label>
      
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            URL ลิงค์
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            อัปโหลดไฟล์
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="url" className="space-y-2">
          <Input
            value={imageUrl}
            onChange={(e) => onImageUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            type="url"
          />
          <p className="text-xs text-gray-500">ใส่ URL ของรูปภาพที่ต้องการใช้</p>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <p className="text-xs text-gray-500">
            รองรับไฟล์รูปภาพ (JPG, PNG, GIF) ขนาดไม่เกิน 5MB
          </p>
          {uploading && (
            <p className="text-sm text-blue-600">กำลังอัปโหลด...</p>
          )}
        </TabsContent>
      </Tabs>

      {imageUrl && (
        <div className="mt-4">
          <Label className="text-sm text-gray-600">ตัวอย่างรูปภาพ:</Label>
          <div className="mt-2 border rounded-lg overflow-hidden w-full max-w-sm">
            <img 
              src={imageUrl} 
              alt="Campaign preview" 
              className="w-full h-32 object-cover"
              onError={() => {
                toast({
                  variant: "destructive",
                  title: "ไม่สามารถโหลดรูปภาพได้",
                  description: "กรุณาตรวจสอบ URL อีกครั้ง"
                });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
