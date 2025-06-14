
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

type Campaign = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  points: number;
  start_date: string | null;
  end_date: string | null;
  status: string;
};

export const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .in('status', ['active', 'promoted', 'coming_soon'])
          .limit(4)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setCampaigns(data as Campaign[] || []);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        // ใช้ข้อมูลตัวอย่างในกรณีเกิดข้อผิดพลาด
        setCampaigns([
          {
            id: 'sample-1',
            title: 'ถุงผ้ารักษ์โลก',
            description: 'ร่วมรณรงค์การใช้ถุงผ้าแทนถุงพลาสติกในชีวิตประจำวัน แชร์ภาพการใช้ถุงผ้าสะสมแต้ม',
            image_url: 'https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=500&q=80',
            points: 1,
            start_date: null,
            end_date: null,
            status: 'active'
          },
          {
            id: 'sample-2',
            title: 'แก้วและหลอดรียูส',
            description: 'ส่งเสริมการใช้แก้วน้ำและหลอดแบบใช้ซ้ำ แชร์ภาพการใช้แก้วและหลอดส่วนตัวสะสมแต้ม',
            image_url: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=500&q=80',
            points: 2,
            start_date: null,
            end_date: null,
            status: 'active'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);

  // ในกรณีข้อมูลไม่มี ใช้ข้อมูลตัวอย่าง 2 อัน
  const displayCampaigns = campaigns.length > 0 ? campaigns : [
    {
      id: 'sample-1',
      title: 'ถุงผ้ารักษ์โลก',
      description: 'ร่วมรณรงค์การใช้ถุงผ้าแทนถุงพลาสติกในชีวิตประจำวัน แชร์ภาพการใช้ถุงผ้าสะสมแต้ม',
      image_url: 'https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=500&q=80',
      points: 1,
      start_date: null,
      end_date: null,
      status: 'active'
    },
    {
      id: 'sample-2',
      title: 'แก้วและหลอดรียูส',
      description: 'ส่งเสริมการใช้แก้วน้ำและหลอดแบบใช้ซ้ำ แชร์ภาพการใช้แก้วและหลอดส่วนตัวสะสมแต้ม',
      image_url: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=500&q=80',
      points: 2,
      start_date: null,
      end_date: null,
      status: 'active'
    }
  ];
  
  // แปลงสถานะเป็นภาษาไทย
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'กำลังดำเนินการ';
      case 'promoted':
        return 'โปรโมตแล้ว';
      case 'coming_soon':
        return 'เร็วๆ นี้';
      case 'completed':
        return 'สิ้นสุดแล้ว';
      default:
        return 'กำลังจะมาถึง';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'promoted':
        return 'destructive';
      case 'coming_soon':
        return 'secondary';
      default:
        return 'outline';
    }
  };

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
          {displayCampaigns.slice(0, 2).map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
              <div className="aspect-video relative">
                <img 
                  src={campaign.image_url || "https://placehold.co/500x300/e5f7f0/2c7873?text=Campaign+Image"} 
                  alt={campaign.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant={getStatusVariant(campaign.status) as any}>
                    {getStatusText(campaign.status)}
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-eco-blue mb-2">{campaign.title}</h3>
                <p className="text-gray-600 mb-4">
                  {campaign.description || "ร่วมกิจกรรมรักษ์โลกกับเรา เพื่อสิ่งแวดล้อมที่ยั่งยืน"}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">คะแนน: {campaign.points} แต้ม/ครั้ง</span>
                  <Button asChild className="bg-eco-gradient hover:opacity-90">
                    <Link to={`/campaigns/${campaign.id}`}>เข้าร่วม</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
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
