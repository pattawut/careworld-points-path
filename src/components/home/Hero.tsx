
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Hero = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-eco-gradient opacity-90 -z-10"></div>
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10 -z-10 leaf-pattern"></div>
      
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="inline-block">
              <Badge className="bg-white/20 text-white hover:bg-white/30">
                โครงการ "Love Global"
              </Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              CareWorld รักษ์โลก <br />
              <span className="text-eco-light">เพื่อโลกที่ยั่งยืน</span>
            </h1>
            <p className="text-lg text-white/80 max-w-lg">
              ร่วมสร้างการเปลี่ยนแปลงเพื่อสิ่งแวดล้อม ด้วยการแยกขยะและลดขยะพลาสติก สะสมแต้มแลกของรางวัล และร่วมสร้างโลกที่น่าอยู่ไปด้วยกัน
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" asChild className="bg-white text-eco-teal hover:bg-eco-light">
                <Link to="/register">เข้าร่วมกับเรา</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="bg-transparent text-white border-white hover:bg-white/20">
                <Link to="/education">เรียนรู้เพิ่มเติม</Link>
              </Button>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=500&q=80" 
              alt="Earth sustainability"
              className="rounded-lg shadow-2xl max-w-md animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
