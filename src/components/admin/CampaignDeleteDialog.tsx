
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Campaign {
  id: string;
  title: string;
}

interface CampaignDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign | null;
  onSuccess: () => void;
}

export const CampaignDeleteDialog = ({ open, onOpenChange, campaign, onSuccess }: CampaignDeleteDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!campaign) return;

    setLoading(true);
    try {
      // First delete related point logs to avoid foreign key constraint issues
      const { error: pointLogsError } = await supabase
        .from('user_point_logs')
        .delete()
        .eq('campaign_id', campaign.id);

      if (pointLogsError) {
        console.error('Error deleting point logs:', pointLogsError);
        // Continue with campaign deletion even if point logs deletion fails
      }

      // Then delete the campaign
      const { error: campaignError } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaign.id);

      if (campaignError) throw campaignError;

      toast({
        title: "ลบสำเร็จ",
        description: "กิจกรรมและประวัติคะแนนที่เกี่ยวข้องได้รับการลบแล้ว"
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบกิจกรรมได้"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>ลบกิจกรรม</DialogTitle>
          <DialogDescription>
            คุณแน่ใจหรือไม่ที่จะลบกิจกรรม "{campaign?.title}" การดำเนินการนี้จะลบกิจกรรมและประวัติคะแนนที่เกี่ยวข้องทั้งหมด และไม่สามารถยกเลิกได้
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "กำลังลบ..." : "ลบ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
