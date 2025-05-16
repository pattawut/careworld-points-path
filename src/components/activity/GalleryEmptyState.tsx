
import React from 'react';
import { Link } from 'react-router-dom';

export const GalleryEmptyState = () => {
  return (
    <div className="col-span-3 text-center py-10">
      <p className="text-gray-500 mb-2">ยังไม่มีกิจกรรมในขณะนี้</p>
      <p>
        <Link to="/dashboard" className="text-eco-teal hover:underline">
          เป็นคนแรกที่แชร์กิจกรรมรักษ์โลก
        </Link>
      </p>
    </div>
  );
};
