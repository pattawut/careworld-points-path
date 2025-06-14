
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ActivityGalleryItem } from './ActivityGalleryItem';
import { GalleryEmptyState } from './GalleryEmptyState';
import { ActivityLoading } from './ActivityLoading';

type Campaign = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  activity_type: string | null;
  created_at: string;
  points: number;
  user_id: string | null;
  status: string;
  user: {
    full_name: string;
    avatar_url: string | null;
  };
};

type CampaignActivityGalleryProps = {
  campaignTitle: string;
  showCaption?: boolean;
  limit?: number;
}

export const CampaignActivityGallery = ({ 
  campaignTitle, 
  showCaption = true, 
  limit 
}: CampaignActivityGalleryProps) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCampaignActivities = async () => {
      try {
        setLoading(true);
        
        // Fetch user activities that match this campaign title pattern
        let query = supabase
          .from('campaigns')
          .select('*')
          .not('user_id', 'is', null) // Only user-created activities
          .ilike('title', `%${campaignTitle}%`) // Match campaign title
          .order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data: campaignsData, error: campaignsError } = await query;

        if (campaignsError) {
          throw campaignsError;
        }

        if (!campaignsData || campaignsData.length === 0) {
          setCampaigns([]);
          setLoading(false);
          return;
        }

        // Get unique user IDs for profile lookup
        const userIds = [...new Set(campaignsData.map(campaign => campaign.user_id).filter(Boolean))];
        
        let profilesData: any[] = [];
        if (userIds.length > 0) {
          const { data, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', userIds);

          if (profilesError) {
            throw profilesError;
          }
          profilesData = data || [];
        }

        // Create a lookup map for profiles
        const profilesMap = profilesData.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);

        // Combine campaigns with their user data
        const campaignsWithUserData = campaignsData.map(campaign => ({
          ...campaign,
          user: {
            full_name: campaign.user_id ? (profilesMap[campaign.user_id]?.full_name || 'ผู้ใช้') : 'ระบบ',
            avatar_url: campaign.user_id ? profilesMap[campaign.user_id]?.avatar_url : null
          }
        })) as Campaign[];

        setCampaigns(campaignsWithUserData);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดกิจกรรมได้",
        });
        console.error('Error fetching campaign activities:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (campaignTitle) {
      fetchCampaignActivities();
    }
  }, [toast, limit, campaignTitle]);

  if (loading) {
    return <ActivityLoading />;
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">ยังไม่มีใครเข้าร่วมกิจกรรมนี้</p>
        <p className="text-sm text-gray-400">เป็นคนแรกที่เข้าร่วมกิจกรรมนี้!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <ActivityGalleryItem 
          key={campaign.id} 
          activity={{
            id: campaign.id,
            description: campaign.description || campaign.title || '',
            image_url: campaign.image_url || '',
            activity_type: campaign.activity_type || 'general',
            created_at: campaign.created_at,
            points: campaign.points,
            user: campaign.user
          }} 
          showCaption={showCaption} 
        />
      ))}
    </div>
  );
};
