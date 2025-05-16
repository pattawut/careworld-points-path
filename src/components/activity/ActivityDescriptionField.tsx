
import React from 'react';

interface ActivityDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
}

export const ActivityDescriptionField = ({ value, onChange, isDisabled = false }: ActivityDescriptionFieldProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="description" className="text-sm font-medium">
        คำอธิบายกิจกรรม
      </label>
      <textarea 
        id="description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="อธิบายสั้นๆ เกี่ยวกับกิจกรรมของคุณ"
        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        disabled={isDisabled}
        required
      />
    </div>
  );
};
