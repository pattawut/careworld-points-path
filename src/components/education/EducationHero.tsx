
import React from 'react';
import { Badge } from '@/components/ui/badge';

export const EducationHero = () => {
  return (
    <section className="relative py-20 bg-eco-gradient">
      <div className="container px-4 md:px-6">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            ศูนย์ความรู้
          </h1>
          <p className="text-xl md:text-2xl text-eco-light mb-8">
            เรียนรู้วิธีการดูแลสิ่งแวดล้อมและสร้างโลกที่ยั่งยืน
          </p>
          <Badge className="bg-white/20 text-white text-lg px-6 py-2">
            รู้จัก รู้ทำ รู้คิด เพื่อโลกใส
          </Badge>
        </div>
      </div>
    </section>
  );
};
