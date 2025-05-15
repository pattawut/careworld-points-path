
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

type Activity = {
  id: string;
  description: string;
  image_url: string;
  activity_type: string;
  created_at: string;
  points: number;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
};

export const ActivityGallery = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('activities')
          .select('*, profiles(full_name, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          throw error;
        }

        setActivities(data as Activity[]);
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
  }, [toast]);

  const getActivityTypeLabel = (type: string) => {
    switch(type) {
      case 'recycle': return 'คัดแยกขยะ';
      case 'bag': return 'ใช้ถุงผ้า';
      case 'cup': return 'ใช้แก้วส่วนตัว';
      case 'straw': return 'ใช้หลอดส่วนตัว';
      default: return type;
    }
  };
  
  const getActivityTypeColor = (type: string) => {
    switch(type) {
      case 'recycle': return 'bg-green-500';
      case 'bag': return 'bg-blue-500';
      case 'cup': return 'bg-purple-500';
      case 'straw': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-none shadow-md overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.length > 0 ? (
        activities.map((activity) => (
          <Card key={activity.id} className="border-none shadow-md overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img 
                src={activity.image_url} 
                alt={activity.description} 
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar>
                  <AvatarImage src={activity.profiles.avatar_url || undefined} />
                  <AvatarFallback>{activity.profiles.full_name?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-eco-blue">{activity.profiles.full_name || 'ผู้ใช้'}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.created_at), { 
                      addSuffix: true,
                      locale: th
                    })}
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge className={`${getActivityTypeColor(activity.activity_type)}`}>
                    {getActivityTypeLabel(activity.activity_type)}
                  </Badge>
                </div>
              </div>
              <p className="text-gray-700 line-clamp-2">{activity.description}</p>
              <div className="mt-2 text-right">
                <span className="text-sm font-medium text-eco-teal">+{activity.points} แต้ม</span>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-3 text-center py-10">
          <p className="text-gray-500 mb-2">ยังไม่มีกิจกรรมในขณะนี้</p>
          <p>
            <Link to="/dashboard" className="text-eco-teal hover:underline">
              เป็นคนแรกที่แชร์กิจกรรมรักษ์โลก
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};
