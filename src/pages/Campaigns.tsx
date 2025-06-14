
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { CampaignCard } from '@/components/campaigns/CampaignCard';
import { toast } from '@/components/ui/use-toast';

interface Campaign {
  id: string;
  title: string;
  description: string;
  image_url: string;
  points: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  tags?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

const Campaigns = () => {
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [upcomingCampaigns, setUpcomingCampaigns] = useState<Campaign[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState('ทั้งหมด');
  const [activeLoading, setActiveLoading] = useState(true);
  const [upcomingLoading, setUpcomingLoading] = useState(true);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('campaign_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchCampaignsWithTags = async (campaignsData: any[]) => {
    return await Promise.all(
      campaignsData.map(async (campaign) => {
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
  };

  const fetchActiveCampaigns = async () => {
    try {
      setActiveLoading(true);

      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (campaignsError) throw campaignsError;

      const campaignsWithTags = await fetchCampaignsWithTags(campaignsData || []);
      setActiveCampaigns(campaignsWithTags);
    } catch (error) {
      console.error('Error fetching active campaigns:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลแคมเปญที่เปิดให้สมัครได้"
      });
    } finally {
      setActiveLoading(false);
    }
  };

  const fetchUpcomingCampaigns = async () => {
    try {
      setUpcomingLoading(true);

      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'coming_soon')
        .order('created_at', { ascending: false });

      if (campaignsError) throw campaignsError;

      const campaignsWithTags = await fetchCampaignsWithTags(campaignsData || []);
      setUpcomingCampaigns(campaignsWithTags);
    } catch (error) {
      console.error('Error fetching upcoming campaigns:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลแคมเปญที่กำลังจะมาถึงได้"
      });
    } finally {
      setUpcomingLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
    fetchActiveCampaigns();
    fetchUpcomingCampaigns();
  }, []);

  const filteredActiveCampaigns = activeCampaigns.filter(campaign => {
    if (selectedTag === 'ทั้งหมด') return true;
    return campaign.tags?.some(tag => tag.name === selectedTag);
  });

  const filteredUpcomingCampaigns = upcomingCampaigns.filter(campaign => {
    if (selectedTag === 'ทั้งหมด') return true;
    return campaign.tags?.some(tag => tag.name === selectedTag);
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10 bg-eco-light">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-eco-blue mb-4">
              แคมเปญกิจกรรม
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ร่วมกิจกรรมเพื่อสิ่งแวดล้อมและรับคะแนนเพื่อแลกของรางวัล
            </p>
          </div>

          {/* Tag filters */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            <Badge
              variant={selectedTag === 'ทั้งหมด' ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-eco-teal hover:text-white transition-colors"
              onClick={() => setSelectedTag('ทั้งหมด')}
            >
              ทั้งหมด
            </Badge>
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTag === tag.name ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-eco-teal hover:text-white transition-colors"
                style={{
                  backgroundColor: selectedTag === tag.name ? tag.color : 'transparent',
                  color: selectedTag === tag.name ? 'white' : tag.color,
                  borderColor: tag.color
                }}
                onClick={() => setSelectedTag(tag.name)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>

          {/* Active Campaigns Section */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-eco-blue mb-3">
                กิจกรรมที่เปิดให้สมัคร
              </h2>
              <p className="text-gray-600">
                กิจกรรมที่สามารถเข้าร่วมได้ในขณะนี้
              </p>
            </div>

            {activeLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-eco-teal border-t-transparent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActiveCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            )}

            {!activeLoading && filteredActiveCampaigns.length === 0 && (
              <Card className="border-none shadow-lg">
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600 mb-4">ไม่พบแคมเปญที่เปิดให้สมัครในหมวดหมู่นี้</p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Upcoming Campaigns Section */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-eco-blue mb-3">
                แคมเปญที่กำลังจะมาถึง
              </h2>
              <p className="text-gray-600">
                กิจกรรมที่จะเปิดให้สมัครในอนาคตอันใกล้
              </p>
            </div>

            {upcomingLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-eco-teal border-t-transparent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUpcomingCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            )}

            {!upcomingLoading && filteredUpcomingCampaigns.length === 0 && (
              <Card className="border-none shadow-lg">
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600 mb-4">ยังไม่มีแคมเปญที่กำลังจะมาถึงในหมวดหมู่นี้</p>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Campaigns;
