
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import { CampaignDialog } from './CampaignDialog';
import { CampaignDeleteDialog } from './CampaignDeleteDialog';
import { CampaignManagementCard } from './CampaignManagementCard';

interface Campaign {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  points: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  tags?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

export const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const { toast } = useToast();

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      
      // First, fetch campaigns
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignsError) throw campaignsError;

      // Then, fetch tags for each campaign
      const campaignsWithTags = await Promise.all(
        (campaignsData || []).map(async (campaign) => {
          const { data: tagData, error: tagError } = await supabase
            .from('campaign_tag_relations')
            .select(`
              campaign_tags (
                id,
                name,
                color
              )
            `)
            .eq('campaign_id', campaign.id);

          if (tagError) {
            console.error('Error fetching tags for campaign:', campaign.id, tagError);
            return { ...campaign, tags: [] };
          }

          const tags = tagData?.map(relation => relation.campaign_tags).filter(Boolean) || [];
          return { ...campaign, tags };
        })
      );

      setCampaigns(campaignsWithTags);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลกิจกรรมได้"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleStatusChange = async (campaignId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ status: newStatus })
        .eq('id', campaignId);

      if (error) throw error;

      await fetchCampaigns();
      toast({
        title: "อัปเดตสำเร็จ",
        description: "สถานะกิจกรรมได้รับการอัปเดตแล้ว"
      });
    } catch (error) {
      console.error('Error updating campaign status:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะได้"
      });
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setDialogOpen(true);
  };

  const handleDelete = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedCampaign(null);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-eco-teal border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">จัดการกิจกรรม</h3>
          <p className="text-sm text-gray-600">สร้าง แก้ไข และจัดการกิจกรรมทั้งหมด</p>
        </div>
        <Button onClick={handleCreate} className="bg-eco-gradient">
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มกิจกรรม
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => (
          <CampaignManagementCard
            key={campaign.id}
            campaign={campaign}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {campaigns.length === 0 && (
        <Card className="border-none shadow-md">
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">ยังไม่มีกิจกรรม</p>
            <Button onClick={handleCreate} className="bg-eco-gradient">
              เพิ่มกิจกรรมแรก
            </Button>
          </CardContent>
        </Card>
      )}

      <CampaignDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        campaign={selectedCampaign}
        onSuccess={fetchCampaigns}
      />

      <CampaignDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        campaign={selectedCampaign}
        onSuccess={fetchCampaigns}
      />
    </div>
  );
};
