
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type Campaign = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  image_urls?: string[];
  points: number;
  start_date: string | null;
  end_date: string | null;
  status: string;
  activity_type: string | null;
  tags?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
};

export const useCampaignData = (id: string | undefined, userId: string | undefined) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [userHasParticipated, setUserHasParticipated] = useState(false);
  const { toast } = useToast();

  const fetchCampaign = async () => {
    if (!id) return;

    try {
      setLoading(true);
      
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .select('*, image_urls')
        .eq('id', id)
        .single();

      if (campaignError) throw campaignError;

      // Fetch tags for the campaign
      const { data: tagData, error: tagError } = await supabase
        .from('campaign_tag_relations')
        .select(`
          campaign_tags (
            id,
            name,
            color
          )
        `)
        .eq('campaign_id', id);

      if (tagError) {
        console.error('Error fetching tags:', tagError);
      }

      const tags = tagData?.map(relation => relation.campaign_tags).filter(Boolean) || [];
      
      // Use image_urls from database if available, otherwise fall back to image_url
      let image_urls: string[] = [];
      if (campaignData.image_urls && Array.isArray(campaignData.image_urls) && campaignData.image_urls.length > 0) {
        // Use the new image_urls column - filter and convert to strings
        image_urls = campaignData.image_urls.filter((url): url is string => typeof url === 'string');
      } else if (campaignData.image_url) {
        // Fall back to single image_url
        image_urls = [campaignData.image_url];
      }
      
      setCampaign({
        ...campaignData,
        tags,
        image_urls: image_urls.length > 0 ? image_urls : undefined
      });
    } catch (error) {
      console.error('Error fetching campaign:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลแคมเปญได้"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkUserParticipation = async () => {
    if (!userId || !id || !campaign) return;

    try {
      // Count how many times user has participated in this campaign
      const { data, error } = await supabase
        .from('campaigns')
        .select('id')
        .eq('user_id', userId)
        .ilike('title', `${campaign.title}%`)
        .eq('status', 'completed');

      if (error) throw error;

      setUserHasParticipated(data && data.length > 0);
    } catch (error) {
      console.error('Error checking participation:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCampaign();
    }
  }, [id]);

  useEffect(() => {
    if (userId && campaign) {
      checkUserParticipation();
    }
  }, [userId, campaign]);

  return {
    campaign,
    loading,
    userHasParticipated,
    setUserHasParticipated
  };
};
