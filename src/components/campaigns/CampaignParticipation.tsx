
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ActivityImageUpload } from '@/components/activity/ActivityImageUpload';
import { Award } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    console.log('File selected:', file);
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
    console.log('Starting submission process...');
    console.log('User:', user);
    console.log('Campaign:', campaign);
    console.log('Selected file:', selectedFile);
    console.log('Description:', description);

    if (!user) {
      console.error('No user found');
      toast({
        variant: "destructive",
        title: "กรุณาเข้าสู่ระบบ",
        description: "คุณต้องเข้าสู่ระบบเพื่อเข้าร่วมแคมเปญ"
      });
      return;
    }

    if (!campaign) {
      console.error('No campaign found');
      toast({
        variant: "destructive",
        title: "ไม่พบแคมเปญ",
        description: "กรุณาลองใหม่อีกครั้ง"
      });
      return;
    }

    if (!selectedFile) {
      console.error('No file selected');
      toast({
        variant: "destructive",
        title: "กรุณาเลือกรูปภาพ",
        description: "คุณต้องอัปโหลดรูปภาพเพื่อเข้าร่วมแคมเปญ"
      });
      return;
    }

    if (!description.trim()) {
      console.error('No description provided');
      toast({
        variant: "destructive",
        title: "กรุณาใส่คำอธิบาย",
        description: "คุณต้องใส่คำอธิบายกิจกรรมของคุณ"
      });
      return;
    }

    setSubmitting(true);

    try {
      console.log('Starting file upload...');
      
      // Upload image to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${user.id}.${fileExt}`;
      const filePath = `activities/${fileName}`;

      console.log('Uploading file to path:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('campaign-images')
        .upload(filePath, selectedFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`การอัปโหลดรูปภาพล้มเหลว: ${uploadError.message}`);
      }

      console.log('File uploaded successfully:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(uploadData.path);

      console.log('Public URL:', publicUrl);

      // Create user activity record (allow multiple participations)
      const campaignData = {
        title: `${campaign.title} - กิจกรรมของ ${user.email}`,
        description: description,
        image_url: publicUrl,
        points: campaign.points,
        user_id: user.id,
        activity_type: campaign.activity_type,
        status: 'completed'
      };

      console.log('Creating campaign with data:', campaignData);

      const { data: newCampaign, error: insertError } = await supabase
        .from('campaigns')
        .insert(campaignData)
        .select('id')
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(`การบันทึกกิจกรรมล้มเหลว: ${insertError.message}`);
      }

      console.log('New campaign created:', newCampaign);

      // Copy tags from original campaign to user's activity
      if (campaign.tags && campaign.tags.length > 0 && newCampaign) {
        console.log('Copying tags:', campaign.tags);
        
        const tagRelations = campaign.tags.map(tag => ({
          campaign_id: newCampaign.id,
          tag_id: tag.id
        }));

        console.log('Tag relations to insert:', tagRelations);

        const { error: tagError } = await supabase
          .from('campaign_tag_relations')
          .insert(tagRelations);

        if (tagError) {
          console.error('Error copying tags:', tagError);
          // Don't throw error as the main activity was created successfully
        } else {
          console.log('Tags copied successfully');
        }
      }

      console.log('Activity submission completed successfully');

      toast({
        title: "เข้าร่วมสำเร็จ!",
        description: `คุณได้รับ ${campaign.points} แต้มจากการเข้าร่วมแคมเปญนี้`
      });

      // Reset form for next participation
      setSelectedFile(null);
      setPreview(null);
      setDescription('');
      onParticipationSuccess();

    } catch (error) {
      console.error('Error submitting activity:', error);
      
      let errorMessage = "ไม่สามารถส่งกิจกรรมได้ กรุณาลองใหม่อีกครั้ง";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: errorMessage
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
          <br />
          <span className="text-eco-teal font-medium">
            คุณสามารถเข้าร่วมกิจกรรมนี้ได้หลายครั้งเพื่อสะสมคะแนน
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
        
        {userHasParticipated && (
          <div className="text-center py-4">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm text-green-600 font-medium">
              คุณเคยเข้าร่วมแคมเปญนี้แล้ว แต่สามารถเข้าร่วมอีกครั้งได้เพื่อสะสมคะแนนเพิ่มเติม
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
