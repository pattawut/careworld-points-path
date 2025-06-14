
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
};

export function ActivityGallery({ showUserActivities = false }: ActivityGalleryProps) {
  const [activities, setActivities] = useState<ActivityWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [showUserActivities]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('activities')
        .select(`
          id,
          description,
          image_url,
          activity_type,
          created_at,
          points,
          user_id,
          profiles!inner(
            full_name,
            avatar_url,
            id
          )
        `)
        .order('created_at', { ascending: false });

      if (showUserActivities) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('user_id', user.id);
        }
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;

      if (data) {
        const formattedActivities: ActivityWithUser[] = data.map((activity: any) => ({
          id: activity.id,
          description: activity.description,
          image_url: activity.image_url,
          activity_type: activity.activity_type,
          created_at: activity.created_at,
          points: activity.points,
          user: {
            full_name: activity.profiles.full_name,
            avatar_url: activity.profiles.avatar_url,
            id: activity.profiles.id
          }
        }));
        
        setActivities(formattedActivities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
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
        />
      ))}
    </div>
  );
}
