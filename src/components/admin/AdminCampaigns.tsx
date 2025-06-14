
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import { CampaignDialog } from './CampaignDialog';
import { CampaignDeleteDialog } from './CampaignDeleteDialog';

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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: 'ฉบับร่าง', variant: 'secondary' as const },
      active: { label: 'เปิดใช้งาน', variant: 'default' as const },
      promoted: { label: 'โปรโมต', variant: 'destructive' as const },
      coming_soon: { label: 'เร็วๆ นี้', variant: 'outline' as const },
      archived: { label: 'เก็บถาวร', variant: 'secondary' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
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
          <Card key={campaign.id} className="border-none shadow-md">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {campaign.description || "ไม่มีคำอธิบาย"}
                  </CardDescription>
                </div>
                {getStatusBadge(campaign.status)}
              </div>
              
              {/* Display campaign tags */}
              {campaign.tags && campaign.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {campaign.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      style={{ 
                        backgroundColor: tag.color + '20', 
                        color: tag.color, 
                        borderColor: tag.color 
                      }}
                      className="text-xs"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">แต้ม:</span>
                  <span className="font-medium text-eco-blue">{campaign.points} แต้ม</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(campaign)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    แก้ไข
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(campaign.id, 'promoted')}
                    disabled={campaign.status === 'promoted'}
                    className="flex-1"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    โปรโมต
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(campaign)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant={campaign.status === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(campaign.id, 'active')}
                    className="flex-1 text-xs"
                  >
                    เปิดใช้งาน
                  </Button>
                  <Button
                    variant={campaign.status === 'coming_soon' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(campaign.id, 'coming_soon')}
                    className="flex-1 text-xs"
                  >
                    เร็วๆ นี้
                  </Button>
                  <Button
                    variant={campaign.status === 'draft' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(campaign.id, 'draft')}
                    className="flex-1 text-xs"
                  >
                    ฉบับร่าง
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
