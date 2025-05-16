
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';
import { ActivityBadge } from './ActivityBadge';
import { ActivityDeleteButton } from './ActivityDeleteButton';

interface ActivityItemProps {
  activity: {
    id: string;
    activity_type: string;
    description: string;
    image_url: string;
    created_at: string;
    points: number;
  };
  onEdit: () => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

export const ActivityItem = ({ activity, onEdit, onDelete, isDeleting }: ActivityItemProps) => {
  return (
    <Card className="border-none shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3 h-48 md:h-auto">
          <img 
            src={activity.image_url || '/placeholder.svg'} 
            alt={activity.description} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-2/3 p-4">
          <div className="flex items-center justify-between mb-2">
            <ActivityBadge type={activity.activity_type} />
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(activity.created_at), { 
                addSuffix: true,
                locale: th
              })}
            </span>
          </div>
          <p className="text-gray-700 mb-4">{activity.description}</p>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-eco-teal">+{activity.points} แต้ม</span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onEdit}
              >
                <Pencil className="h-4 w-4 mr-1" />
                แก้ไข
              </Button>
              
              <ActivityDeleteButton 
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
