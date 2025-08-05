
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Target, Users, Calendar, X } from 'lucide-react';

type Campaign = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  image_urls?: string[];
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
        
        {/* Additional Images */}
        {campaign.image_urls && campaign.image_urls.length > 1 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">รูปภาพเพิ่มเติม</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {campaign.image_urls.slice(1).map((imageUrl, index) => (
                <div 
                  key={index} 
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
                  onClick={() => setSelectedImage(imageUrl)}
                >
                  <img 
                    src={imageUrl} 
                    alt={`รูปภาพเพิ่มเติม ${index + 1}`}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                      คลิกเพื่อขยาย
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative">
            <img 
              src={selectedImage || ''} 
              alt="รูปภาพขยาย"
              className="w-full h-auto max-h-[85vh] object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="ปิด"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
