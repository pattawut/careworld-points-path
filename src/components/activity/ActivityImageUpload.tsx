
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';

interface ActivityImageUploadProps {
  previews: string[];
  onChange: (files: File[]) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
  maxFiles?: number;
}

export const ActivityImageUpload = ({ previews, onChange, isDisabled = false, isRequired = false, maxFiles = 10 }: ActivityImageUploadProps) => {
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length === 0) return;

    const totalFiles = currentFiles.length + newFiles.length;
    if (totalFiles > maxFiles) {
      alert(`สามารถอัปโหลดได้สูงสุด ${maxFiles} รูป`);
      return;
    }

    // ตรวจสอบขนาดไฟล์
    for (const file of newFiles) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`ไฟล์ ${file.name} มีขนาดใหญ่เกิน 5MB`);
        return;
      }
    }

    const updatedFiles = [...currentFiles, ...newFiles];
    setCurrentFiles(updatedFiles);
    onChange(updatedFiles);
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    setCurrentFiles(updatedFiles);
    onChange(updatedFiles);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="image" className="text-sm font-medium">
        รูปภาพกิจกรรม {isRequired && <span className="text-red-500">*</span>}
        <span className="text-xs text-gray-500 ml-2">
          ({previews.length}/{maxFiles} รูป)
        </span>
      </label>
      
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img 
                src={preview} 
                alt={`Preview ${index + 1}`} 
                className="w-full h-32 object-cover rounded-md border"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute top-1 right-1 bg-white p-1 h-6 w-6"
                onClick={() => handleRemoveImage(index)}
                disabled={isDisabled}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}

      {previews.length < maxFiles && (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="image"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-eco-teal bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-3 pb-3">
              <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
              <p className="mb-1 text-sm text-gray-500">
                <span className="font-semibold">เพิ่มรูปภาพ</span>
              </p>
              <p className="text-xs text-gray-500">PNG, JPG หรือ HEIC (สูงสุด 5 MB)</p>
            </div>
            <input
              id="image"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
              disabled={isDisabled}
              required={isRequired && previews.length === 0}
            />
          </label>
        </div>
      )}
    </div>
  );
};
