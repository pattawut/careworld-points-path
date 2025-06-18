
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ActivityImageUpload } from '@/components/activity/ActivityImageUpload';

interface ParticipationFormProps {
  onSubmit: (file: File | null, description: string, quantity: number) => Promise<void>;
  isSubmitting: boolean;
  campaignPoints: number;
}

export const ParticipationForm = ({ onSubmit, isSubmitting, campaignPoints }: ParticipationFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<string>('1'); // เปลี่ยนเป็น string เพื่อให้แก้ไขได้

  const handleFileChange = (file: File | null) => {
    console.log('File selected:', file);
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // อนุญาตให้พิมพ์ตัวเลขได้ และตรวจสอบว่าไม่ต่ำกว่า 1
    if (value === '' || (parseInt(value) >= 1 && !isNaN(parseInt(value)))) {
      setQuantity(value);
    }
  };

  const handleSubmit = async () => {
    const quantityNumber = parseInt(quantity) || 1;
    await onSubmit(selectedFile, description, quantityNumber);
    
    // Reset form after successful submission
    setSelectedFile(null);
    setPreview(null);
    setDescription('');
    setQuantity('1');
  };

  const quantityNumber = parseInt(quantity) || 1;
  const totalPoints = campaignPoints * quantityNumber;

  return (
    <div className="space-y-6">
      <ActivityImageUpload
        preview={preview}
        onChange={handleFileChange}
        isRequired={false}
      />
      
      <div className="space-y-2">
        <Label htmlFor="quantity" className="text-sm font-medium">
          จำนวน (ชิ้น/ครั้ง)
        </Label>
        <Input
          id="quantity"
          type="text"
          value={quantity}
          onChange={handleQuantityChange}
          placeholder="จำนวน เช่น 5 ชิ้น"
          className="w-full"
        />
        <p className="text-xs text-gray-500">
          คะแนนที่จะได้รับ: {campaignPoints} × {quantityNumber} = {totalPoints} แต้ม
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          อธิบายกิจกรรมของคุณ
        </Label>
        <Textarea
          id="description"
          placeholder="เล่าถึงกิจกรรมที่คุณทำ เช่น ใช้ถุงผ้าไปซื้อของที่ตลาด... (ไม่บังคับ)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>
      
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-eco-gradient hover:opacity-90"
      >
        {isSubmitting ? "กำลังส่ง..." : `ส่งกิจกรรมและรับ ${totalPoints} แต้ม`}
      </Button>
    </div>
  );
};
