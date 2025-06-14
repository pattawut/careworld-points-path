
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CampaignActivityGallery } from '@/components/activity/CampaignActivityGallery';

interface CampaignGalleryProps {
  campaignTitle: string;
}

export const CampaignGallery = ({ campaignTitle }: CampaignGalleryProps) => {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-eco-blue">แกลเลอรี่กิจกรรม</CardTitle>
        <CardDescription>
          ชมกิจกรรมที่ผู้ใช้อื่นๆ ได้เข้าร่วมแคมเปญนี้แล้ว
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CampaignActivityGallery 
          campaignTitle={campaignTitle} 
          showCaption={true} 
        />
      </CardContent>
    </Card>
  );
};
