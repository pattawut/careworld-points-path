
import React from 'react';
import { Link } from 'react-router-dom';
import { ActivityIcon } from 'lucide-react';

export const GalleryEmptyState = () => {
  return (
    <div className="col-span-3 text-center py-10">
      <ActivityIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
      <p className="text-gray-500 mb-2">ยังไม่มีกิจกรรมในขณะนี้</p>
      <p>
        <Link to="/login" className="text-eco-teal hover:underline">
          เข้าสู่ระบบเพื่อเป็นคนแรกที่แชร์กิจกรรมรักษ์โลก
        </Link>
      </p>
    </div>
  );
};
