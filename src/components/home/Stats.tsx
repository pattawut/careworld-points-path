
import React from 'react';

export const Stats = () => {
  return (
    <section className="py-20 bg-eco-gradient">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center text-white">
            <div className="text-4xl font-bold mb-2">1,240+</div>
            <p className="text-white/80">สมาชิกร่วมโครงการ</p>
          </div>
          
          <div className="text-center text-white">
            <div className="text-4xl font-bold mb-2">8,750+</div>
            <p className="text-white/80">กิจกรรมที่ทำแล้ว</p>
          </div>
          
          <div className="text-center text-white">
            <div className="text-4xl font-bold mb-2">4,390+</div>
            <p className="text-white/80">กิโลกรัมขยะที่คัดแยก</p>
          </div>
          
          <div className="text-center text-white">
            <div className="text-4xl font-bold mb-2">12,000+</div>
            <p className="text-white/80">ถุงพลาสติกที่ลดได้</p>
          </div>
        </div>
      </div>
    </section>
  );
};
