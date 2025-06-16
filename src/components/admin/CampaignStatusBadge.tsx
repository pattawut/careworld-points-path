
import { Badge } from '@/components/ui/badge';

interface CampaignStatusBadgeProps {
  status: string;
}

interface StatusInfo {
  label: string;
  variant: 'default' | 'secondary' | 'destructive';
  className?: string;
}

export const CampaignStatusBadge = ({ status }: CampaignStatusBadgeProps) => {
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, StatusInfo> = {
      draft: { label: 'ฉบับร่าง', variant: 'secondary' },
      active: { label: 'เปิดใช้งาน', variant: 'default' },
      promoted: { label: 'โปรโมต', variant: 'destructive' },
      coming_soon: { label: 'เร็วๆ นี้', variant: 'secondary', className: 'bg-eco-blue text-white' },
      archived: { label: 'เก็บถาวร', variant: 'secondary' }
    };
    
    const statusInfo = statusMap[status] || statusMap.draft;
    return (
      <Badge 
        variant={statusInfo.variant} 
        className={statusInfo.className}
      >
        {statusInfo.label}
      </Badge>
    );
  };

  return getStatusBadge(status);
};
