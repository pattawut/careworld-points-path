
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ActivityImageUpload } from '@/components/activity/ActivityImageUpload';
import { Award } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type Campaign = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  points: number;
  start_date: string | null;
  end_date: string | null;
  status: string;
  activity_type: string | null;
  tags?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
};

interface CampaignParticipationProps {
  campaign: Campaign;
  userHasParticipated: boolean;
  onParticipationSuccess: () => void;
}

export const CampaignParticipation = ({ 
  campaign, 
  userHasParticipated, 
  onParticipationSuccess 
}: CampaignParticipationProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!user || !campaign) {
      toast({
        variant: "destructive",
        title: "กรุณาเข้าสู่ระบบ",
        description: "คุณต้องเข้าสู่ระบบเพื่อเข้าร่วมแคมเปญ"
      });
      return;
    }

    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "กรุณาเลือกรูปภาพ",
        description: "คุณต้องอัปโหลดรูปภาพเพื่อเข้าร่วมแคมเปญ"
      });
      return;
    }

    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "กรุณาใส่คำอธิบาย",
        description: "คุณต้องใส่คำอธิบายกิจกรรมของคุณ"
      });
      return;
    }

    setSubmitting(true);

    try {
      // Upload image to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${user.id}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('campaign-images')
        .upload(`activities/${fileName}`, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(uploadData.path);

      // Create user activity record that references the original campaign
      const { data: newActivity, error: insertError } = await supabase
        .from('campaigns')
        .insert({
          title: campaign.title, // ใช้ชื่อเดิมของแคมเปญ
          description: description, // คำอธิบายของ user
          image_url: publicUrl, // รูปภาพที่ user อัปโหลด
          points: campaign.points,
          user_id: user.id,
          activity_type: campaign.activity_type,
          status: 'completed'
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      // Copy tags from original campaign to user's activity
      if (campaign.tags && campaign.tags.length > 0 && newActivity) {
        const tagRelations = campaign.tags.map(tag => ({
          campaign_id: newActivity.id,
          tag_id: tag.id
        }));

        const { error: tagError } = await supabase
          .from('campaign_tag_relations')
          .insert(tagRelations);

        if (tagError) {
          console.error('Error copying tags:', tagError);
          // Don't throw error as the main activity was created successfully
        }
      }

      // ไม่ต้องสร้าง point log เพิ่มเติม เพราะ trigger handle_campaign_points จะจัดการให้

      toast({
        title: "เข้าร่วมสำเร็จ!",
        description: `คุณได้รับ ${campaign.points} แต้มจากการเข้าร่วมแคมเปญนี้`
      });

      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setDescription('');
      onParticipationSuccess();

    } catch (error) {
      console.error('Error submitting activity:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งกิจกรรมได้ กรุณาลองใหม่อีกครั้ง"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-eco-blue">ร่วมกิจกรรม</CardTitle>
        <CardDescription>
          อัปโหลดรูปภาพและแชร์ประสบการณ์การทำกิจกรรมรักษ์โลกของคุณ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {userHasParticipated ? (
          <div className="text-center py-12">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Award className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-600 mb-2">เข้าร่วมแล้ว!</h3>
            <p className="text-gray-600">
              คุณได้เข้าร่วมแคมเปญนี้แล้วและได้รับ {campaign.points} แต้ม
            </p>
          </div>
        ) : (
          <>
            <ActivityImageUpload
              preview={preview}
              onChange={handleFileChange}
              isRequired
            />
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                อธิบายกิจกรรมของคุณ <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                placeholder="เล่าถึงกิจกรรมที่คุณทำ เช่น ใช้ถุงผ้าไปซื้อของที่ตลาด..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            
            <Button 
              onClick={handleSubmit}
              disabled={submitting || !selectedFile || !description.trim()}
              className="w-full bg-eco-gradient hover:opacity-90"
            >
              {submitting ? "กำลังส่ง..." : `ส่งกิจกรรมและรับ ${campaign.points} แต้ม`}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
