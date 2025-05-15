
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';
import { ActivityForm } from './ActivityForm';

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
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-eco-teal" />
        <span className="ml-2 text-eco-teal">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className="border-none shadow-md text-center py-10">
        <CardContent>
          <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-xl font-semibold text-eco-blue mb-2">ยังไม่มีกิจกรรม</h3>
          <p className="text-gray-500 mb-4">คุณยังไม่มีการแชร์กิจกรรมรักษ์โลกในระบบ</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="border-none shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 h-48 md:h-auto">
              <img 
                src={activity.image_url || '/placeholder.svg'} 
                alt={activity.description} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge className={`${getActivityTypeColor(activity.activity_type)}`}>
                  {getActivityTypeLabel(activity.activity_type)}
                </Badge>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(activity.created_at), { 
                    addSuffix: true,
                    locale: th
                  })}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{activity.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-eco-teal">+{activity.points} แต้ม</span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setEditingActivity(activity)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    แก้ไข
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        disabled={deletingId === activity.id}
                      >
                        {deletingId === activity.id ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        ลบ
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบกิจกรรม</AlertDialogTitle>
                        <AlertDialogDescription>
                          คุณแน่ใจหรือไม่ว่าต้องการลบกิจกรรมนี้? การดำเนินการนี้ไม่สามารถเรียกคืนได้ และแต้มที่ได้รับจากกิจกรรมนี้จะถูกหักออกจากคะแนนรวมของคุณ
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(activity.id)}>
                          ยืนยัน
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
