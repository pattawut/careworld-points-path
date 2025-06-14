
import { Button } from '@/components/ui/button';

interface CampaignStatusButtonsProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

export const CampaignStatusButtons = ({ 
  currentStatus, 
  onStatusChange 
}: CampaignStatusButtonsProps) => {
  return (
    <div className="flex gap-1">
      <Button
        variant={currentStatus === 'active' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onStatusChange('active')}
        className="flex-1 text-xs"
      >
        เปิดใช้งาน
      </Button>
      <Button
        variant={currentStatus === 'coming_soon' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onStatusChange('coming_soon')}
        className="flex-1 text-xs"
      >
        เร็วๆ นี้
      </Button>
      <Button
        variant={currentStatus === 'draft' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onStatusChange('draft')}
        className="flex-1 text-xs"
      >
        ฉบับร่าง
      </Button>
    </div>
  );
};
