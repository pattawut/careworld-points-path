
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActivityGalleryItem } from './activity/ActivityGalleryItem';
import { GalleryLoading } from './activity/GalleryLoading';
import { GalleryEmptyState } from './activity/GalleryEmptyState';

type ActivityWithUser = {
  id: string;
  description: string;
  image_url: string;
  activity_type: string;
  created_at: string;
  points: number;
  user: {
    full_name: string;
    avatar_url: string;
    id: string;
  };
};

type ActivityGalleryProps = {
  showUserActivities?: boolean;
  showCaption?: boolean;
  limit?: number;
};

export function ActivityGallery({ 
  showUserActivities = false, 
  showCaption = false,
  limit 
}: ActivityGalleryProps) {
  const [activities, setActivities] = useState<ActivityWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [showUserActivities, limit]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      
      // Query from campaigns table since activities table doesn't exist
      let query = supabase
        .from('campaigns')
        .select(`
          id,
          description,
          image_url,
          activity_type,
          created_at,
          points,
          user_id
        `)
        .not('user_id', 'is', null) // Only show user-created campaigns
        .order('created_at', { ascending: false });

      if (showUserActivities) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('user_id', user.id);
        }
      }

      if (limit) {
        query = query.limit(limit);
      } else {
        query = query.limit(20);
      }

      const { data: campaignsData, error } = await query;

      if (error) throw error;

      if (campaignsData && campaignsData.length > 0) {
        // Get unique user IDs for profile lookup
        const userIds = [...new Set(campaignsData.map(campaign => campaign.user_id).filter(Boolean))];
        
        let profilesData: any[] = [];
        if (userIds.length > 0) {
          const { data, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', userIds);

          if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
          } else {
            profilesData = data || [];
          }
        }

        // Create a lookup map for profiles
        const profilesMap = profilesData.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);

        // Format the data to match ActivityWithUser type
        const formattedActivities: ActivityWithUser[] = campaignsData.map((campaign: any) => ({
          id: campaign.id,
          description: campaign.description || 'กิจกรรมรักษ์โลก',
          image_url: campaign.image_url || '',
          activity_type: campaign.activity_type || 'general',
          created_at: campaign.created_at,
          points: campaign.points,
          user: {
            full_name: campaign.user_id ? (profilesMap[campaign.user_id]?.full_name || 'ผู้ใช้') : 'ระบบ',
            avatar_url: campaign.user_id ? profilesMap[campaign.user_id]?.avatar_url : null,
            id: campaign.user_id || ''
          }
        }));
        
        setActivities(formattedActivities);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <GalleryLoading />;
  }

  if (activities.length === 0) {
    return <GalleryEmptyState showUserActivities={showUserActivities} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((activity) => (
        <ActivityGalleryItem
          key={activity.id}
          activity={activity}
          showCaption={showCaption}
        />
      ))}
    </div>
  );
}
