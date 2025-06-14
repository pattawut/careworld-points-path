
import { Badge } from '@/components/ui/badge';

interface CampaignStatusBadgeProps {
  status: string;
}

export const CampaignStatusBadge = ({ status }: CampaignStatusBadgeProps) => {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: 'ฉบับร่าง', variant: 'secondary' as const },
      active: { label: 'เปิดใช้งาน', variant: 'default' as const },
      promoted: { label: 'โปรโมต', variant: 'destructive' as const },
      coming_soon: { label: 'เร็วๆ นี้', variant: 'outline' as const },
      archived: { label: 'เก็บถาวร', variant: 'secondary' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return getStatusBadge(status);
};
