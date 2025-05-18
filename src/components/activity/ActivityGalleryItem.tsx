
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';
import { ActivityBadge } from './ActivityBadge';

interface ActivityGalleryItemProps {
  activity: {
    id: string;
    description: string;
    image_url: string;
    activity_type: string;
    created_at: string;
    points: number;
    user: {
      full_name: string;
      avatar_url: string | null;
    };
  };
  showCaption?: boolean;
}

export const ActivityGalleryItem = ({ activity, showCaption = false }: ActivityGalleryItemProps) => {
  return (
    <Card key={activity.id} className="border-none shadow-md overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img 
          src={activity.image_url} 
          alt={activity.description} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarImage src={activity.user.avatar_url || undefined} />
            <AvatarFallback>{activity.user.full_name?.charAt(0) || '?'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-eco-blue">{activity.user.full_name || 'ผู้ใช้'}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(activity.created_at), { 
                addSuffix: true,
                locale: th
              })}
            </p>
          </div>
          <div className="ml-auto">
            <ActivityBadge type={activity.activity_type} />
          </div>
        </div>
        
        {showCaption && (
          <p className="text-gray-700 line-clamp-2 mb-2">{activity.description}</p>
        )}
        
        <div className="mt-2 text-right">
          <span className="text-sm font-medium text-eco-teal">+{activity.points} แต้ม</span>
        </div>
      </CardContent>
    </Card>
  );
};
