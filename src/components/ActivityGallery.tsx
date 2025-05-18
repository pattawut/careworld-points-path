
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ActivityGalleryItem } from './activity/ActivityGalleryItem';
import { GalleryEmptyState } from './activity/GalleryEmptyState';
import { ActivityLoading } from './activity/ActivityLoading';

type Activity = {
  id: string;
  description: string;
  image_url: string;
  activity_type: string;
  created_at: string;
  points: number;
  user_id: string;
  user: {
    full_name: string;
    avatar_url: string | null;
  };
};

type ActivityGalleryProps = {
  showCaption?: boolean;
  limit?: number;
}

export const ActivityGallery = ({ showCaption = false, limit = 6 }: ActivityGalleryProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        
        // First fetch activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (activitiesError) {
          throw activitiesError;
        }

        if (!activitiesData || activitiesData.length === 0) {
          setActivities([]);
          setLoading(false);
          return;
        }

        // Then fetch profile data for each user_id
        const userIds = [...new Set(activitiesData.map(activity => activity.user_id))];
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);

        if (profilesError) {
          throw profilesError;
        }

        // Create a lookup map for profiles
        const profilesMap = profilesData?.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>) || {};

        // Combine activities with their user data
        const activitiesWithUserData = activitiesData.map(activity => ({
          ...activity,
          user: {
            full_name: profilesMap[activity.user_id]?.full_name || 'ผู้ใช้',
            avatar_url: profilesMap[activity.user_id]?.avatar_url
          }
        })) as Activity[];

        setActivities(activitiesWithUserData);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดกิจกรรมได้",
        });
        console.error('Error fetching activities:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [toast, limit]);

  if (loading) {
    return <ActivityLoading />;
  }

  if (activities.length === 0) {
    return <GalleryEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((activity) => (
        <ActivityGalleryItem key={activity.id} activity={activity} showCaption={showCaption} />
      ))}
    </div>
  );
};
