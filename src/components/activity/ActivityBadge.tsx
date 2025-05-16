
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ActivityBadgeProps {
  type: string;
}

export const ActivityBadge = ({ type }: ActivityBadgeProps) => {
  const getActivityTypeLabel = (type: string) => {
    switch(type) {
      case 'recycle': return 'คัดแยกขยะ';
      case 'bag': return 'ใช้ถุงผ้า';
      case 'cup': return 'ใช้แก้วส่วนตัว';
      case 'straw': return 'ใช้หลอดส่วนตัว';
      default: return type;
    }
  };
  
  const getActivityTypeColor = (type: string) => {
    switch(type) {
      case 'recycle': return 'bg-green-500';
      case 'bag': return 'bg-blue-500';
      case 'cup': return 'bg-purple-500';
      case 'straw': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Badge className={`${getActivityTypeColor(type)}`}>
      {getActivityTypeLabel(type)}
    </Badge>
  );
};
