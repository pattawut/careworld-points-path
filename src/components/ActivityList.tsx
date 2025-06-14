import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ActivityForm } from './ActivityForm';
import { ActivityItem } from './activity/ActivityItem';
import { ActivityEmptyState } from './activity/ActivityEmptyState';
import { ActivityLoading } from './activity/ActivityLoading';
import { usePointLogs } from '@/hooks/usePointLogs';

interface Campaign {
  id: string;
  activity_type: string | null;
  title: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
  points: number;
}

export const ActivityList = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { refetch: refetchPointLogs, refreshProfile } = usePointLogs();

  const fetchUserCampaigns = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setCampaigns(data as Campaign[]);
    } catch (error: any) {
      console.error('Error fetching campaigns:', error);
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
      fetchUserCampaigns();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    
    try {
      setDeletingId(id);
      
      // First, get the campaign to find the image path and points
      const { data: campaign, error: fetchError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // สร้าง point log สำหรับการหักคะแนนก่อนลบ campaign
      if (campaign.points > 0) {
        const { error: pointLogError } = await supabase
          .from('user_point_logs')
          .insert({
            user_id: user.id,
            campaign_id: null, // ไม่อ้างอิงไปที่ campaign ที่จะถูกลบ
            points: campaign.points,
            activity_type: campaign.activity_type,
            description: 'หักคะแนนจากการลบกิจกรรม: ' + (campaign.title || campaign.activity_type),
            action_type: 'deducted'
          });
          
        if (pointLogError) {
          console.error('Error creating point log:', pointLogError);
          // ไม่ throw error เพื่อให้การลบดำเนินต่อไปได้
        }
      }
      
      // Delete the campaign from the database
      const { error: deleteError } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);
        
      if (deleteError) throw deleteError;
      
      // If there was an image, delete it from storage
      if (campaign.image_url) {
        const filePath = `${user.id}/${campaign.image_url.split('/').pop()}`;
        await supabase.storage
          .from('activity-images')
          .remove([filePath]);
      }
      
      // Update local state
      setCampaigns(campaigns.filter(campaign => campaign.id !== id));
      
      // รีเฟรช point logs และ profile หลังจากลบ
      await refetchPointLogs();
      await refreshProfile();
      
      toast({
        title: "ลบกิจกรรมสำเร็จ",
        description: "กิจกรรมถูกลบออกจากระบบเรียบร้อยแล้ว",
      });
    } catch (error: any) {
      console.error('Error deleting campaign:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบกิจกรรมได้",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSuccess = () => {
    setEditingCampaign(null);
    fetchUserCampaigns();
    // รีเฟรช point logs และ profile หลังจากแก้ไข
    refetchPointLogs();
    refreshProfile();
  };

  if (editingCampaign) {
    return (
      <div>
        <Button 
          variant="outline" 
          onClick={() => setEditingCampaign(null)}
          className="mb-4"
        >
          กลับไปยังรายการกิจกรรม
        </Button>
        <ActivityForm 
          activity={{
            id: editingCampaign.id,
            activity_type: editingCampaign.activity_type || 'general',
            description: editingCampaign.description || editingCampaign.title || '',
            image_url: editingCampaign.image_url || ''
          }}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingCampaign(null)}
        />
      </div>
    );
  }

  if (loading) {
    return <ActivityLoading />;
  }

  if (campaigns.length === 0) {
    return <ActivityEmptyState />;
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <ActivityItem 
          key={campaign.id}
          activity={{
            id: campaign.id,
            activity_type: campaign.activity_type || 'general',
            description: campaign.description || campaign.title || '',
            image_url: campaign.image_url || '',
            created_at: campaign.created_at,
            points: campaign.points
          }}
          onEdit={() => setEditingCampaign(campaign)}
          onDelete={() => handleDelete(campaign.id)}
          isDeleting={deletingId === campaign.id}
        />
      ))}
    </div>
  );
};
