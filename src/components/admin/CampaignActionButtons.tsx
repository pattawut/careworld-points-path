
import { Button } from '@/components/ui/button';
import { Edit, TrendingUp, Trash2 } from 'lucide-react';

interface Campaign {
  id: string;
  status: string;
}

interface CampaignActionButtonsProps {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
  onPromote: (campaignId: string) => void;
  onDelete: (campaign: Campaign) => void;
}

export const CampaignActionButtons = ({ 
  campaign, 
  onEdit, 
  onPromote, 
  onDelete 
}: CampaignActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(campaign)}
        className="flex-1"
      >
        <Edit className="h-3 w-3 mr-1" />
        แก้ไข
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPromote(campaign.id)}
        disabled={campaign.status === 'promoted'}
        className="flex-1"
      >
        <TrendingUp className="h-3 w-3 mr-1" />
        โปรโมต
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDelete(campaign)}
        className="text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};
