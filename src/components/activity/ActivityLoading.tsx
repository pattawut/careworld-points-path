
import React from 'react';
import { Loader2 } from 'lucide-react';

export const ActivityLoading = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <Loader2 className="h-8 w-8 animate-spin text-eco-teal" />
      <span className="ml-2 text-eco-teal">กำลังโหลดข้อมูล...</span>
    </div>
  );
};
