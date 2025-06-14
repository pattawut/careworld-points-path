
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type Campaign = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
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
        .select('*')
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
      
      setCampaign({
        ...campaignData,
        tags
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
    if (!userId || !id) return;

    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id')
        .eq('user_id', userId)
        .eq('title', campaign?.title)
        .limit(1);

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
