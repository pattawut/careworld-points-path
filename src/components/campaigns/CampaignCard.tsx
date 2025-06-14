
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Campaign = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  points: number;
  status: string;
  tags?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
};

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'กำลังดำเนินการ';
      case 'promoted':
        return 'โปรโมตแล้ว';
      case 'coming_soon':
        return 'เร็วๆ นี้';
      case 'completed':
        return 'สิ้นสุดแล้ว';
      default:
        return 'กำลังจะมาถึง';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'promoted':
        return 'destructive';
      case 'coming_soon':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
      <div className="aspect-video relative">
        <img 
          src={campaign.image_url || "https://placehold.co/500x300/e5f7f0/2c7873?text=Campaign+Image"} 
          alt={campaign.title || 'Campaign'}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={getStatusVariant(campaign.status) as any}>
            {getStatusText(campaign.status)}
          </Badge>
        </div>
        {campaign.status === 'promoted' && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-red-500 text-white">โปรโมต</Badge>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-eco-blue mb-2">{campaign.title || 'แคมเปญ'}</h3>
        <p className="text-gray-600 mb-4">
          {campaign.description || "ร่วมแคมเปญรักษ์โลกกับเรา เพื่อสิ่งแวดล้อมที่ยั่งยืน"}
        </p>
        
        {campaign.tags && campaign.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
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
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">คะแนน: {campaign.points} แต้ม/ครั้ง</span>
          <Button asChild className="bg-eco-gradient hover:opacity-90">
            <Link to={`/campaigns/${campaign.id}`}>เข้าร่วม</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
