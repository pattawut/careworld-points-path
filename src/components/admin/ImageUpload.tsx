
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Link } from 'lucide-react';

interface ImageUploadProps {
  imageUrls: string[];
  onImageUrlsChange: (urls: string[]) => void;
  maxImages?: number;
}

export const ImageUpload = ({ imageUrls, onImageUrlsChange, maxImages = 10 }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const totalImages = imageUrls.length + files.length;
    if (totalImages > maxImages) {
      toast({
        variant: "destructive",
        title: "จำนวนรูปภาพเกินขีดจำกัด",
        description: `สามารถอัปโหลดได้สูงสุด ${maxImages} รูป`
      });
      return;
    }

    // ตรวจสอบประเภทไฟล์และขนาด
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "ประเภทไฟล์ไม่ถูกต้อง",
          description: `${file.name} ไม่ใช่ไฟล์รูปภาพ`
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "ไฟล์ใหญ่เกินไป",
          description: `${file.name} มีขนาดใหญ่เกิน 5MB`
        });
        return;
      }
    }

    setUploading(true);
    const newUrls: string[] = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('campaign-images')
          .upload(fileName, file);

        if (error) throw error;

        // สร้าง public URL
        const { data: { publicUrl } } = supabase.storage
          .from('campaign-images')
          .getPublicUrl(data.path);

        newUrls.push(publicUrl);
      }

      onImageUrlsChange([...imageUrls, ...newUrls]);
      
      toast({
        title: "อัปโหลดสำเร็จ",
        description: `อัปโหลดรูปภาพ ${files.length} รูปแล้ว`
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปโหลดรูปภาพได้"
      });
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleUrlAdd = (url: string) => {
    if (imageUrls.length >= maxImages) {
      toast({
        variant: "destructive",
        title: "จำนวนรูปภาพเกินขีดจำกัด",
        description: `สามารถเพิ่มได้สูงสุด ${maxImages} รูป`
      });
      return;
    }
    onImageUrlsChange([...imageUrls, url]);
  };

  const handleRemoveImage = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    onImageUrlsChange(newUrls);
  };

  return (
    <div className="space-y-4">
      <Label>รูปภาพ ({imageUrls.length}/{maxImages})</Label>
      
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
            placeholder="https://example.com/image.jpg (กด Enter เพื่อเพิ่ม)"
            type="url"
            disabled={imageUrls.length >= maxImages}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const input = e.target as HTMLInputElement;
                const url = input.value.trim();
                if (url) {
                  handleUrlAdd(url);
                  input.value = '';
                }
              }
            }}
          />
          <p className="text-xs text-gray-500">ใส่ URL ของรูปภาพและกด Enter เพื่อเพิ่ม</p>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={uploading || imageUrls.length >= maxImages}
          />
          <p className="text-xs text-gray-500">
            รองรับไฟล์รูปภาพ (JPG, PNG, GIF) ขนาดไม่เกิน 5MB
          </p>
          {uploading && (
            <p className="text-sm text-blue-600">กำลังอัปโหลด...</p>
          )}
        </TabsContent>
      </Tabs>

      {imageUrls.length > 0 && (
        <div className="mt-4 space-y-2">
          <Label className="text-sm text-gray-600">รูปภาพที่เลือก:</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative border rounded-lg overflow-hidden">
                <img 
                  src={url} 
                  alt={`Campaign image ${index + 1}`} 
                  className="w-full h-32 object-cover"
                  onError={() => {
                    toast({
                      variant: "destructive",
                      title: "ไม่สามารถโหลดรูปภาพได้",
                      description: `รูปที่ ${index + 1} ไม่สามารถแสดงได้`
                    });
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 p-1 h-6 w-6"
                  onClick={() => handleRemoveImage(index)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
