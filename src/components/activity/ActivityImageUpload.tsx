
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';

interface ActivityImageUploadProps {
  preview: string | null;
  onChange: (file: File | null) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
}

export const ActivityImageUpload = ({ preview, onChange, isDisabled = false, isRequired = false }: ActivityImageUploadProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleRemoveImage = () => {
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="image" className="text-sm font-medium">
        รูปภาพกิจกรรม {isRequired && <span className="text-red-500">*</span>}
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
            onClick={handleRemoveImage}
            disabled={isDisabled}
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
              disabled={isDisabled}
              required={isRequired}
            />
          </label>
        </div>
      )}
    </div>
  );
};
