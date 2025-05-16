
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { RecycleIcon, ShoppingBag, Award } from 'lucide-react';

export const Features = () => {
  return (
    <section className="py-20 bg-eco-light">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-eco-blue mb-3">วิธีการเข้าร่วมโครงการ</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            มาร่วมเป็นส่วนหนึ่งในการดูแลสิ่งแวดล้อมและสร้างความยั่งยืนไปด้วยกัน ด้วยขั้นตอนง่ายๆ
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6 border-none shadow-md hover:shadow-lg transition-shadow">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-eco-teal/10">
              <RecycleIcon className="h-6 w-6 text-eco-teal" />
            </div>
            <h3 className="text-xl font-semibold text-eco-blue mb-2">แยกขยะทุกวัน</h3>
            <p className="text-gray-600 mb-4">
              แยกประเภทขยะตามหลักการ และถ่ายรูปการจัดการขยะของคุณ
            </p>
            <Link to="/activities" className="text-eco-teal hover:text-eco-blue transition-colors font-medium inline-flex items-center">
              ดูรายละเอียด
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </Card>
          
          <Card className="p-6 border-none shadow-md hover:shadow-lg transition-shadow">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-eco-teal/10">
              <ShoppingBag className="h-6 w-6 text-eco-teal" />
            </div>
            <h3 className="text-xl font-semibold text-eco-blue mb-2">ใช้ถุงผ้าและแก้วส่วนตัว</h3>
            <p className="text-gray-600 mb-4">
              ลดการใช้พลาสติกในชีวิตประจำวันด้วยการใช้ถุงผ้าและแก้วน้ำส่วนตัว
            </p>
            <Link to="/campaigns/bag" className="text-eco-teal hover:text-eco-blue transition-colors font-medium inline-flex items-center">
              ดูรายละเอียด
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </Card>
          
          <Card className="p-6 border-none shadow-md hover:shadow-lg transition-shadow">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-eco-teal/10">
              <Award className="h-6 w-6 text-eco-teal" />
            </div>
            <h3 className="text-xl font-semibold text-eco-blue mb-2">รับแต้มสะสม</h3>
            <p className="text-gray-600 mb-4">
              ทำกิจกรรมแล้วรับแต้ม เพื่อแลกของรางวัลและติดอันดับผู้นำการรักษ์โลก
            </p>
            <Link to="/leaderboard" className="text-eco-teal hover:text-eco-blue transition-colors font-medium inline-flex items-center">
              ดูรายละเอียด
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </Card>
        </div>
      </div>
    </section>
  );
};
