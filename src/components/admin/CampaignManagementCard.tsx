
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import { CampaignActionButtons } from './CampaignActionButtons';
import { CampaignStatusButtons } from './CampaignStatusButtons';

interface Campaign {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  points: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  tags?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

interface CampaignManagementCardProps {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
  onStatusChange: (campaignId: string, newStatus: string) => void;
}

export const CampaignManagementCard = ({ 
  campaign, 
  onEdit, 
  onDelete, 
  onStatusChange 
}: CampaignManagementCardProps) => {
  const handlePromote = (campaignId: string) => {
    onStatusChange(campaignId, 'promoted');
  };

  const handleStatusChange = (status: string) => {
    onStatusChange(campaign.id, status);
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{campaign.title}</CardTitle>
            <CardDescription className="mt-1">
              {campaign.description || "ไม่มีคำอธิบาย"}
            </CardDescription>
          </div>
          <CampaignStatusBadge status={campaign.status} />
        </div>
        
        {/* Display campaign tags */}
        {campaign.tags && campaign.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
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
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">แต้ม:</span>
            <span className="font-medium text-eco-blue">{campaign.points} แต้ม</span>
          </div>
          
          <CampaignActionButtons
            campaign={campaign}
            onEdit={onEdit}
            onPromote={handlePromote}
            onDelete={onDelete}
          />

          <CampaignStatusButtons
            currentStatus={campaign.status}
            onStatusChange={handleStatusChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};
