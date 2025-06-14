
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { CampaignsHeader } from '@/components/campaigns/CampaignsHeader';
import { TagFilters } from '@/components/campaigns/TagFilters';
import { CampaignSection } from '@/components/campaigns/CampaignSection';
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
          <CampaignsHeader />
          
          <TagFilters 
            tags={tags}
            selectedTag={selectedTag}
            onTagSelect={setSelectedTag}
          />

          <CampaignSection
            title="กิจกรรมที่เปิดให้สมัคร"
            subtitle="กิจกรรมที่สามารถเข้าร่วมได้ในขณะนี้"
            campaigns={filteredActiveCampaigns}
            loading={activeLoading}
            emptyMessage="ไม่พบแคมเปญที่เปิดให้สมัครในหมวดหมู่นี้"
          />

          <CampaignSection
            title="แคมเปญที่กำลังจะมาถึง"
            subtitle="กิจกรรมที่จะเปิดให้สมัครในอนาคตอันใกล้"
            campaigns={filteredUpcomingCampaigns}
            loading={upcomingLoading}
            emptyMessage="ยังไม่มีแคมเปญที่กำลังจะมาถึงในหมวดหมู่นี้"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Campaigns;
