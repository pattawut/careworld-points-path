import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Award } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  description: string;
  image_url: string;
  points: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  tags?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'เปิดใช้งาน', variant: 'default' as const },
      coming_soon: { label: 'เร็วๆ นี้', variant: 'secondary' as const, className: 'bg-eco-blue text-white' },
      promoted: { label: 'โปรโมต', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.active;
    return (
      <Badge 
        variant={statusInfo.variant}
        className={'className' in statusInfo ? statusInfo.className : undefined}
      >
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow border-none shadow-md overflow-hidden">
      <div className="relative aspect-video">
        <img 
          src={campaign.image_url || "https://placehold.co/400x200/e5f7f0/2c7873?text=Campaign+Image"}
          alt={campaign.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          {getStatusBadge(campaign.status)}
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex flex-wrap gap-1 mb-2">
          {campaign.tags?.map((tag) => (
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
        <h3 className="text-lg font-semibold text-eco-blue group-hover:text-eco-teal transition-colors">
          {campaign.title}
        </h3>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm line-clamp-2">
          {campaign.description}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-eco-teal">
            <Award className="h-4 w-4" />
            <span className="font-medium">{campaign.points} แต้ม</span>
          </div>
          
          {campaign.start_date && (
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{new Date(campaign.start_date).toLocaleDateString('th-TH')}</span>
            </div>
          )}
        </div>
        
        <Button asChild className="w-full bg-eco-gradient hover:opacity-90">
          <Link to={`/campaigns/${campaign.id}`}>
            {campaign.status === 'coming_soon' ? 'ดูรายละเอียด' : 'เข้าร่วมกิจกรรม'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
