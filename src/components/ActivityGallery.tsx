
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ActivityGalleryItem } from './activity/ActivityGalleryItem';
import { GalleryEmptyState } from './activity/GalleryEmptyState';
import { ActivityLoading } from './activity/ActivityLoading';

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

type ActivityGalleryProps = {
  showCaption?: boolean;
  limit?: number;
  showUserActivities?: boolean;
}

export const ActivityGallery = ({ showCaption = false, limit = 6, showUserActivities = false }: ActivityGalleryProps) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        
        // Fetch campaigns
        let query = supabase
          .from('campaigns')
          .select('*')
          .order('created_at', { ascending: false });

        if (showUserActivities) {
          // Show only user-created activities (campaigns with user_id and image_url)
          query = query
            .not('user_id', 'is', null)
            .not('image_url', 'is', null);
        } else {
          // Show system campaigns (campaigns without user_id or with specific status)
          query = query
            .is('user_id', null)
            .in('status', ['active', 'promoted', 'coming_soon']);
        }

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

        // Get unique user IDs for profile lookup (only for user activities)
        if (showUserActivities) {
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
        } else {
          // For system campaigns, set default user info
          const campaignsWithUserData = campaignsData.map(campaign => ({
            ...campaign,
            user: {
              full_name: 'ระบบ',
              avatar_url: null
            }
          })) as Campaign[];

          setCampaigns(campaignsWithUserData);
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดกิจกรรมได้",
        });
        console.error('Error fetching campaigns:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [toast, limit, showUserActivities]);

  if (loading) {
    return <ActivityLoading />;
  }

  if (campaigns.length === 0) {
    if (showUserActivities) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">ยังไม่มีใครอัปโหลดกิจกรรม</p>
          <p className="text-sm text-gray-400">เป็นคนแรกที่แชร์กิจกรรมรักษ์โลกของคุณ!</p>
        </div>
      );
    }
    return <GalleryEmptyState />;
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
