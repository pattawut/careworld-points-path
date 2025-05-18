
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ActivityGallery } from '@/components/ActivityGallery';

export const RecentActivities = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-eco-blue mb-3">กิจกรรมล่าสุด</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            กิจกรรมการรักษ์โลกล่าสุดจากสมาชิก CareWorld ที่ร่วมแบ่งปันความประทับใจ
          </p>
        </div>
        
        <ActivityGallery showCaption={true} />
        
        <div className="text-center mt-10">
          <Button variant="outline" asChild className="border-eco-teal text-eco-teal hover:bg-eco-teal hover:text-white">
            <Link to="/activities">ดูกิจกรรมทั้งหมด</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
