
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Users, Award, ShoppingBag, RecycleIcon } from 'lucide-react';

const Hero = () => {
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

const Features = () => {
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

const Campaigns = () => {
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

const Stats = () => {
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

const LeaderboardPreview = () => {
  const topUsers = [
    {
      id: 1,
      name: 'สมชาย ใจดี',
      points: 530,
      activities: 42,
      avatar: 'https://i.pravatar.cc/100?img=1'
    },
    {
      id: 2,
      name: 'สมหญิง รักโลก',
      points: 480,
      activities: 38,
      avatar: 'https://i.pravatar.cc/100?img=5'
    },
    {
      id: 3,
      name: 'ภาสกร นิยมไทย',
      points: 450,
      activities: 36,
      avatar: 'https://i.pravatar.cc/100?img=3'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-eco-blue mb-3">อันดับผู้นำ</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            สมาชิกที่มีคะแนนสูงสุดจากการร่วมกิจกรรมต่างๆ ในโครงการ CareWorld รักษ์โลก
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {topUsers.map((user, index) => (
            <Card key={user.id} className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow p-6 text-center">
              <div className="absolute top-3 left-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-eco-gradient text-white font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-4">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="rounded-full object-cover w-full h-full border-4 border-eco-teal"
                  />
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2">
                      <Award className="h-8 w-8 text-yellow-400" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-eco-blue mb-1">{user.name}</h3>
                <p className="text-gray-600 text-sm mb-4">กิจกรรมที่ร่วม: {user.activities}</p>
                <div className="bg-eco-light rounded-full px-4 py-2 font-semibold text-eco-blue">
                  {user.points} แต้ม
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button asChild className="bg-eco-gradient hover:opacity-90">
            <Link to="/leaderboard">ดูอันดับทั้งหมด</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const CallToAction = () => {
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

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Campaigns />
        <Stats />
        <LeaderboardPreview />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
