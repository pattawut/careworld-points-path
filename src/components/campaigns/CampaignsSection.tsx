
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { CampaignCard } from './CampaignCard';

type Campaign = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  points: number;
  start_date: string | null;
  end_date: string | null;
  status: string;
  tags?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
};

export const CampaignsSection = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        
        const { data: campaignsData, error } = await supabase
          .from('campaigns')
          .select('*')
          .in('status', ['promoted', 'active'])
          .is('user_id', null)
          .order('status', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(4);
          
        if (error) {
          throw error;
        }
        
        const campaignsWithTags = await Promise.all(
          (campaignsData || []).map(async (campaign) => {
            const { data: tagData, error: tagError } = await supabase
              .from('campaign_tag_relations')
              .select(`
                campaign_tags (
                  id,
                  name,
                  color
                )
              `)
              .eq('campaign_id', campaign.id);

            if (tagError) {
              console.error('Error fetching tags for campaign:', campaign.id, tagError);
              return { ...campaign, tags: [] };
            }

            const tags = tagData?.map(relation => relation.campaign_tags).filter(Boolean) || [];
            return { ...campaign, tags };
          })
        );
        
        setCampaigns(campaignsWithTags as Campaign[]);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setCampaigns([
          {
            id: 'sample-1',
            title: 'ถุงผ้ารักษ์โลก',
            description: 'ร่วมรณรงค์การใช้ถุงผ้าแทนถุงพลาสติกในชีวิตประจำวัน แชร์ภาพการใช้ถุงผ้าสะสมแต้ม',
            image_url: 'https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=500&q=80',
            points: 1,
            start_date: null,
            end_date: null,
            status: 'active',
            tags: [{ id: '1', name: 'ถุงผ้า', color: '#10B981' }]
          },
          {
            id: 'sample-2',
            title: 'แก้วและหลอดรียูส',
            description: 'ส่งเสริมการใช้แก้วน้ำและหลอดแบบใช้ซ้ำ แชร์ภาพการใช้แก้วและหลอดส่วนตัวสะสมแต้ม',
            image_url: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=500&q=80',
            points: 2,
            start_date: null,
            end_date: null,
            status: 'active',
            tags: [{ id: '2', name: 'นำกลับมาใช้ซ้ำ', color: '#3B82F6' }]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);

  const displayCampaigns = campaigns.length > 0 ? campaigns : [
    {
      id: 'sample-1',
      title: 'ถุงผ้ารักษ์โลก',
      description: 'ร่วมรณรงค์การใช้ถุงผ้าแทนถุงพลาสติกในชีวิตประจำวัน แชร์ภาพการใช้ถุงผ้าสะสมแต้ม',
      image_url: 'https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=500&q=80',
      points: 1,
      start_date: null,
      end_date: null,
      status: 'active',
      tags: [{ id: '1', name: 'ถุงผ้า', color: '#10B981' }]
    },
    {
      id: 'sample-2',
      title: 'แก้วและหลอดรียูส',
      description: 'ส่งเสริมการใช้แก้วน้ำและหลอดแบบใช้ซ้ำ แชร์ภาพการใช้แก้วและหลอดส่วนตัวสะสมแต้ม',
      image_url: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=500&q=80',
      points: 2,
      start_date: null,
      end_date: null,
      status: 'active',
      tags: [{ id: '2', name: 'นำกลับมาใช้ซ้ำ', color: '#3B82F6' }]
    }
  ];

  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-eco-blue mb-3">แคมเปญล่าสุด</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ร่วมแคมเปญต่างๆ ของเราเพื่อสร้างการเปลี่ยนแปลงเชิงบวกให้กับสิ่งแวดล้อม
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayCampaigns.slice(0, 2).map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button variant="outline" asChild className="border-eco-teal text-eco-teal hover:bg-eco-teal hover:text-white">
            <Link to="/campaigns">ดูแคมเปญทั้งหมด</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
