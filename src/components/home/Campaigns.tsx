
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Campaigns = () => {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-eco-blue mb-3">แคมเปญล่าสุด</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ร่วมกิจกรรมต่างๆ ของเราเพื่อสร้างการเปลี่ยนแปลงเชิงบวกให้กับสิ่งแวดล้อม
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
            <div className="aspect-video relative">
              <img 
                src="https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=500&q=80" 
                alt="ถุงผ้ารักษ์โลก"
                className="object-cover w-full h-full"
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-eco-teal">กำลังดำเนินการ</Badge>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-eco-blue mb-2">ถุงผ้ารักษ์โลก</h3>
              <p className="text-gray-600 mb-4">
                ร่วมรณรงค์การใช้ถุงผ้าแทนถุงพลาสติกในชีวิตประจำวัน แชร์ภาพการใช้ถุงผ้าสะสมแต้ม
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">คะแนน: 1 แต้ม/ครั้ง</span>
                <Button asChild className="bg-eco-gradient hover:opacity-90">
                  <Link to="/campaigns/bag">เข้าร่วม</Link>
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
            <div className="aspect-video relative">
              <img 
                src="https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=500&q=80" 
                alt="แก้วและหลอดรียูส"
                className="object-cover w-full h-full"
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-eco-teal">กำลังดำเนินการ</Badge>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-eco-blue mb-2">แก้วและหลอดรียูส</h3>
              <p className="text-gray-600 mb-4">
                ส่งเสริมการใช้แก้วน้ำและหลอดแบบใช้ซ้ำ แชร์ภาพการใช้แก้วและหลอดส่วนตัวสะสมแต้ม
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">คะแนน: 1 แต้ม/ครั้ง</span>
                <Button asChild className="bg-eco-gradient hover:opacity-90">
                  <Link to="/campaigns/reuse">เข้าร่วม</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="text-center mt-10">
          <Button variant="outline" asChild className="border-eco-teal text-eco-teal hover:bg-eco-teal hover:text-white">
            <Link to="/activities">ดูกิจกรรมทั้งหมด</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
