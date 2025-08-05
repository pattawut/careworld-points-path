
import { Badge } from '@/components/ui/badge';
import { Calendar, Award } from 'lucide-react';

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

interface CampaignHeaderProps {
  campaign: Campaign;
}

export const CampaignHeader = ({ campaign }: CampaignHeaderProps) => {
  return (
    <div className="relative mb-8">
      <div className="aspect-video md:aspect-[3/1] relative rounded-xl overflow-hidden">
        <img 
          src={(campaign.image_urls && campaign.image_urls.length > 0) ? campaign.image_urls[0] : campaign.image_url || "https://placehold.co/1200x400/e5f7f0/2c7873?text=Campaign+Image"}
          alt={campaign.title || 'Campaign'}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {campaign.tags?.map((tag) => (
              <Badge
                key={tag.id}
                style={{ 
                  backgroundColor: tag.color + '20', 
                  color: tag.color, 
                  borderColor: tag.color 
                }}
                className="border"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {campaign.title || 'แคมเปญ'}
          </h1>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-1">
              <Award className="h-5 w-5" />
              <span>{campaign.points} แต้ม/ครั้ง</span>
            </div>
            {campaign.start_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-5 w-5" />
                <span>เริ่ม: {new Date(campaign.start_date).toLocaleDateString('th-TH')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
