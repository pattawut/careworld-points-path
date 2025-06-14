import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActivityGalleryItem } from './activity/ActivityGalleryItem';
import { GalleryLoading } from './activity/GalleryLoading';
import { GalleryEmptyState } from './activity/GalleryEmptyState';
import { getAvatarUrl } from '@/utils/avatarUtils';

type ActivityWithUser = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  created_at: string;
  user_id: string;
  user: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
};

type ActivityGalleryProps = {
  showCaption?: boolean;
  showUserActivities?: boolean;
  limit?: number;
  userId?: string;
};

export const ActivityGallery = ({ 
  showCaption = false, 
  showUserActivities = false, 
  limit,
  userId 
}: ActivityGalleryProps) => {
  const [activities, setActivities] = useState<ActivityWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('campaigns')
          .select(`
            id,
            title,
            description,
            image_url,
            created_at,
            user_id,
            profiles!inner(
              id,
              full_name,
              avatar_url
            )
          `)
          .not('image_url', 'is', null)
          .order('created_at', { ascending: false });

        if (userId) {
          query = query.eq('user_id', userId);
        }

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          const activitiesWithUser = data.map(activity => ({
            id: activity.id,
            title: activity.title || 'ไม่ระบุชื่อกิจกรรม',
            description: activity.description,
            image_url: activity.image_url!,
            created_at: activity.created_at,
            user_id: activity.user_id!,
            user: {
              id: activity.profiles.id,
              full_name: activity.profiles.full_name || 'ไม่ระบุชื่อ',
              avatar_url: getAvatarUrl(activity.profiles.avatar_url, activity.profiles.id)
            }
          }));
          
          setActivities(activitiesWithUser);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [limit, userId]);

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
          showUserActivities={showUserActivities}
        />
      ))}
    </div>
  );
};
