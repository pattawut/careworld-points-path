
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const CallToAction = () => {
  return (
    <section className="py-20 bg-eco-light">
      <div className="container px-4 md:px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 leaf-pattern"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-eco-blue mb-4">พร้อมร่วมเป็นส่วนหนึ่งกับเราหรือยัง?</h2>
              <p className="text-gray-600 mb-6">
                สมัครเป็นสมาชิกวันนี้ และเริ่มร่วมกิจกรรมเพื่อสะสมแต้ม แลกของรางวัล และสร้างผลกระทบเชิงบวกต่อสิ่งแวดล้อม
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-eco-gradient hover:opacity-90">
                  <Link to="/register">สมัครสมาชิก</Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-eco-teal text-eco-teal hover:bg-eco-teal hover:text-white">
                  <Link to="/login">เข้าสู่ระบบ</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1550643747-49d67106a371?auto=format&fit=crop&w=400&q=80" 
                alt="Earth Day"
                className="rounded-lg shadow-lg max-w-sm animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
