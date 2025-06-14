
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Calendar } from 'lucide-react';

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

interface CampaignDetailsProps {
  campaign: Campaign;
}

export const CampaignDetails = ({ campaign }: CampaignDetailsProps) => {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-eco-blue">รายละเอียดแคมเปญ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">คำอธิบาย</h3>
          <p className="text-gray-700 leading-relaxed">
            {campaign.description || "ร่วมแคมเปญรักษ์โลกกับเรา เพื่อสิ่งแวดล้อมที่ยั่งยืน"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-eco-teal" />
              <div>
                <p className="font-medium">คะแนนที่ได้รับ</p>
                <p className="text-gray-600">{campaign.points} แต้มต่อการเข้าร่วม</p>
              </div>
            </div>
            
            {campaign.activity_type && (
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-eco-teal" />
                <div>
                  <p className="font-medium">ประเภทกิจกรรม</p>
                  <p className="text-gray-600">{campaign.activity_type}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {campaign.start_date && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-eco-teal" />
                <div>
                  <p className="font-medium">วันที่เริ่ม</p>
                  <p className="text-gray-600">
                    {new Date(campaign.start_date).toLocaleDateString('th-TH')}
                  </p>
                </div>
              </div>
            )}
            
            {campaign.end_date && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-eco-teal" />
                <div>
                  <p className="font-medium">วันที่สิ้นสุด</p>
                  <p className="text-gray-600">
                    {new Date(campaign.end_date).toLocaleDateString('th-TH')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
