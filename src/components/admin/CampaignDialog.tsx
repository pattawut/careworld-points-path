
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth';

interface Campaign {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  points: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
}

interface CampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign | null;
  onSuccess: () => void;
}

export const CampaignDialog = ({ open, onOpenChange, campaign, onSuccess }: CampaignDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [points, setPoints] = useState(1);
  const [status, setStatus] = useState('draft');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (campaign) {
      setTitle(campaign.title);
      setDescription(campaign.description || '');
      setImageUrl(campaign.image_url || '');
      setPoints(campaign.points);
      setStatus(campaign.status);
      setStartDate(campaign.start_date ? campaign.start_date.split('T')[0] : '');
      setEndDate(campaign.end_date ? campaign.end_date.split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setImageUrl('');
      setPoints(1);
      setStatus('draft');
      setStartDate('');
      setEndDate('');
    }
  }, [campaign]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const campaignData = {
        title,
        description: description || null,
        image_url: imageUrl || null,
        points,
        status,
        start_date: startDate ? new Date(startDate).toISOString() : null,
        end_date: endDate ? new Date(endDate).toISOString() : null,
        created_by: user.id
      };

      if (campaign) {
        // Update existing campaign
        const { error } = await supabase
          .from('campaigns')
          .update(campaignData)
          .eq('id', campaign.id);

        if (error) throw error;

        toast({
          title: "อัปเดตสำเร็จ",
          description: "กิจกรรมได้รับการอัปเดตแล้ว"
        });
      } else {
        // Create new campaign
        const { error } = await supabase
          .from('campaigns')
          .insert(campaignData);

        if (error) throw error;

        toast({
          title: "สร้างสำเร็จ",
          description: "กิจกรรมใหม่ได้รับการสร้างแล้ว"
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกกิจกรรมได้"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {campaign ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรมใหม่'}
          </DialogTitle>
          <DialogDescription>
            {campaign ? 'แก้ไขข้อมูลกิจกรรม' : 'กรอกข้อมูลกิจกรรมใหม่'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">ชื่อกิจกรรม *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ชื่อกิจกรรม"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">คำอธิบาย</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="คำอธิบายกิจกรรม"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL รูปภาพ</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              type="url"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points">แต้มที่ได้รับ *</Label>
              <Input
                id="points"
                type="number"
                min="1"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">สถานะ</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">ฉบับร่าง</SelectItem>
                  <SelectItem value="active">เปิดใช้งาน</SelectItem>
                  <SelectItem value="promoted">โปรโมต</SelectItem>
                  <SelectItem value="coming_soon">เร็วๆ นี้</SelectItem>
                  <SelectItem value="archived">เก็บถาวร</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">วันที่เริ่ม</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">วันที่สิ้นสุด</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading} className="bg-eco-gradient">
              {loading ? "กำลังบันทึก..." : campaign ? "อัปเดต" : "สร้าง"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
