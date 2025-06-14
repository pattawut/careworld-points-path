
import React from 'react';
import { Button } from '@/components/ui/button';

export const CallToActionSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold text-eco-blue mb-4">
          พร้อมเริ่มต้นแล้วหรือยัง?
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          นำความรู้ที่ได้ไปใช้ในชีวิตประจำวัน และร่วมสร้างการเปลี่ยนแปลงเพื่อโลกที่ยั่งยืน
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-eco-gradient hover:opacity-90">
            เริ่มทำกิจกรรม
          </Button>
          <Button variant="outline" size="lg" className="border-eco-teal text-eco-teal hover:bg-eco-teal hover:text-white">
            ดูแคมเปญทั้งหมด
          </Button>
        </div>
      </div>
    </section>
  );
};
