
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
  title?: string;
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
      
      if (showUserActivities) {
        // ถ้า showUserActivities เป็น true แต่ไม่มี user login ให้แสดงเป็น empty
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // ไม่มี user login ให้ return activities ว่าง
          setActivities([]);
          setLoading(false);
          return;
        }
        
        // Query user's own campaigns only
        let query = supabase
          .from('campaigns')
          .select(`
            id,
            title,
            description,
            image_url,
            activity_type,
            created_at,
            points,
            user_id
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        } else {
          query = query.limit(20);
        }

        const { data: campaignsData, error } = await query;

        if (error) throw error;

        if (campaignsData && campaignsData.length > 0) {
          // Get user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', user.id)
            .single();

          // Format the data to match ActivityWithUser type
          const formattedActivities: ActivityWithUser[] = campaignsData.map((campaign: any) => ({
            id: campaign.id,
            title: campaign.title,
            description: campaign.description || 'กิจกรรมรักษ์โลก',
            image_url: campaign.image_url || '',
            activity_type: campaign.activity_type || 'general',
            created_at: campaign.created_at,
            points: campaign.points,
            user: {
              full_name: profileData?.full_name || 'ผู้ใช้',
              avatar_url: profileData?.avatar_url || null,
              id: user.id
            }
          }));
          
          setActivities(formattedActivities);
        } else {
          setActivities([]);
        }
      } else {
        // แสดงกิจกรรมทั้งหมดของ user ทุกคน (ไม่ต้อง login)
        // ใช้วิธี public query โดยไม่ผ่าน RLS
        let query = supabase
          .from('campaigns')
          .select(`
            id,
            title,
            description,
            image_url,
            activity_type,
            created_at,
            points,
            user_id
          `)
          .not('user_id', 'is', null) // เฉพาะ user-created campaigns
          .not('image_url', 'is', null) // เฉพาะที่มีรูป
          .order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        } else {
          query = query.limit(20);
        }

        const { data: campaignsData, error } = await query;

        if (error) {
          console.error('Error fetching campaigns:', error);
          setActivities([]);
          return;
        }

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
            title: campaign.title,
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
