
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Leaf, Calendar, Users } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  points: number;
  status: string;
}

export const AvailableCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActiveCampaigns = async () => {
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('id, title, description, image_url, points, status')
          .in('status', ['active', 'promoted'])
          .is('user_id', null) // Only system campaigns, not user activities
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        setCampaigns(data || []);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast({
          variant: "destructive",
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลแคมเปญได้"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActiveCampaigns();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-eco-teal border-t-transparent"></div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">ยังไม่มีแคมเปญที่เปิดให้เข้าร่วม</h3>
        <p className="text-gray-500">โปรดติดตามแคมเปญใหม่ ๆ ในเร็ว ๆ นี้</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-eco-teal/10 flex items-center justify-center">
                {campaign.image_url ? (
                  <img 
                    src={campaign.image_url} 
                    alt={campaign.title}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <Leaf className="h-5 w-5 text-eco-teal" />
                )}
              </div>
              <CardTitle className="text-lg">{campaign.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {campaign.description || 'ร่วมกิจกรรมนี้เพื่อสร้างการเปลี่ยนแปลงเชิงบวกต่อสิ่งแวดล้อม'}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-eco-blue">+{campaign.points} คะแนน</span>
              <Button 
                asChild 
                variant="outline" 
                className="border-eco-teal text-eco-teal hover:bg-eco-teal hover:text-white"
              >
                <Link to={`/campaigns/${campaign.id}`}>เข้าร่วม</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
