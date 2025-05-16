
import React from 'react';

interface ActivityTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
}

export const ActivityTypeSelector = ({ value, onChange, isDisabled = false }: ActivityTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="activityType" className="text-sm font-medium">
        ประเภทกิจกรรม
      </label>
      <select 
        id="activityType"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        disabled={isDisabled}
      >
        <option value="recycle">คัดแยกขยะ</option>
        <option value="bag">ใช้ถุงผ้า</option>
        <option value="cup">ใช้แก้วส่วนตัว</option>
        <option value="straw">ใช้หลอดส่วนตัว</option>
      </select>
    </div>
  );
};
