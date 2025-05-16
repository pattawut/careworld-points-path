
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ActivityFormButtonsProps {
  isLoading: boolean;
  isEditing: boolean;
  isValid: boolean;
  onCancel?: () => void;
}

export const ActivityFormButtons = ({ isLoading, isEditing, isValid, onCancel }: ActivityFormButtonsProps) => {
  return (
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
        disabled={isLoading || !isValid}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditing ? 'บันทึกการแก้ไข' : 'อัปโหลดกิจกรรม'}
      </Button>
    </div>
  );
};
