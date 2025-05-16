
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ActivityForm } from './ActivityForm';
import { ActivityItem } from './activity/ActivityItem';
import { ActivityEmptyState } from './activity/ActivityEmptyState';
import { ActivityLoading } from './activity/ActivityLoading';

interface Activity {
  id: string;
  activity_type: string;
  description: string;
  image_url: string;
  created_at: string;
  points: number;
}

export const ActivityList = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUserActivities = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setActivities(data as Activity[]);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลกิจกรรมได้",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserActivities();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    
    try {
      setDeletingId(id);
      
      // First, get the activity to find the image path
      const { data: activity, error: fetchError } = await supabase
        .from('activities')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Delete the activity from the database
      const { error: deleteError } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);
        
      if (deleteError) throw deleteError;
      
      // If there was an image, delete it from storage
      if (activity.image_url) {
        const filePath = `${user.id}/${activity.image_url.split('/').pop()}`;
        await supabase.storage
          .from('activity-images')
          .remove([filePath]);
      }
      
      // Update local state
      setActivities(activities.filter(activity => activity.id !== id));
      
      toast({
        title: "ลบกิจกรรมสำเร็จ",
        description: "กิจกรรมถูกลบออกจากระบบเรียบร้อยแล้ว",
      });
    } catch (error: any) {
      console.error('Error deleting activity:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบกิจกรรมได้",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (editingActivity) {
    return (
      <div>
        <Button 
          variant="outline" 
          onClick={() => setEditingActivity(null)}
          className="mb-4"
        >
          กลับไปยังรายการกิจกรรม
        </Button>
        <ActivityForm 
          activity={editingActivity}
          onSuccess={() => {
            setEditingActivity(null);
            fetchUserActivities();
          }}
          onCancel={() => setEditingActivity(null)}
        />
      </div>
    );
  }

  if (loading) {
    return <ActivityLoading />;
  }

  if (activities.length === 0) {
    return <ActivityEmptyState />;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityItem 
          key={activity.id}
          activity={activity}
          onEdit={() => setEditingActivity(activity)}
          onDelete={() => handleDelete(activity.id)}
          isDeleting={deletingId === activity.id}
        />
      ))}
    </div>
  );
};
