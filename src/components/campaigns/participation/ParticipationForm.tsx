
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ActivityImageUpload } from '@/components/activity/ActivityImageUpload';

interface ParticipationFormProps {
  onSubmit: (file: File, description: string) => Promise<void>;
  isSubmitting: boolean;
  campaignPoints: number;
}

export const ParticipationForm = ({ onSubmit, isSubmitting, campaignPoints }: ParticipationFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');

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

  const handleSubmit = async () => {
    if (!selectedFile || !description.trim()) return;
    
    await onSubmit(selectedFile, description);
    
    // Reset form after successful submission
    setSelectedFile(null);
    setPreview(null);
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <ActivityImageUpload
        preview={preview}
        onChange={handleFileChange}
        isRequired
      />
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          อธิบายกิจกรรมของคุณ <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="description"
          placeholder="เล่าถึงกิจกรรมที่คุณทำ เช่น ใช้ถุงผ้าไปซื้อของที่ตลาด..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>
      
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting || !selectedFile || !description.trim()}
        className="w-full bg-eco-gradient hover:opacity-90"
      >
        {isSubmitting ? "กำลังส่ง..." : `ส่งกิจกรรมและรับ ${campaignPoints} แต้ม`}
      </Button>
    </div>
  );
};
